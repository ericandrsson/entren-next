import React, { useEffect, useState, useCallback, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { pb } from "@/lib/db";
import { SpotInterface, transformOverpassNode } from "@/types/Spot";

interface UnverifiedSpotsLayerProps {
  onNodeClick: (node: SpotInterface) => void;
}

const UnverifiedSpotsLayer: React.FC<UnverifiedSpotsLayerProps> = ({
  onNodeClick,
}) => {
  const [nodes, setNodes] = useState<SpotInterface[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const map = useMap();
  const lastFetchRef = useRef<number>(0);

  const fetchExistingNodeIds = async (
    osmIds: number[]
  ): Promise<Set<number>> => {
    try {
      const result = await pb.collection("spots").getList(1, 1000, {
        filter: `data.osm_id?~ "${osmIds.join("|")}"`,
        fields: "data.osm_id",
      });
      console.log("Existing node IDs:", result.items);
      return new Set(result.items.map((item) => Number(item.osm_id)));
    } catch (error) {
      console.error("Error fetching existing node IDs:", error);
      return new Set();
    }
  };

  const fetchNodes = useCallback(
    async (bounds: L.LatLngBounds, zoom: number) => {
      if (isLoading || zoom < 14) return;

      setIsLoading(true);
      setError(null);

      // Adjust the bounding box based on zoom level
      const adjustedBounds = adjustBoundsForZoom(bounds, zoom);
      const bbox = `${adjustedBounds.getSouth()},${adjustedBounds.getWest()},${adjustedBounds.getNorth()},${adjustedBounds.getEast()}`;
      const query = `
      [out:json][timeout:25];
      (
        // Main categories
        node["shop"](${bbox});
        node["amenity"="restaurant"](${bbox});
        node["amenity"="cafe"](${bbox});
        node["tourism"](${bbox});
        node["amenity"="school"](${bbox});
        node["amenity"="hospital"](${bbox});
        node["amenity"="bank"](${bbox});
        node["leisure"](${bbox});
        node["amenity"="toilets"](${bbox});

        // Accessibility-related tags
        node["wheelchair"](${bbox});
        node["wheelchair:toilet"](${bbox});
        node["amenity"="parking"]["disabled"](${bbox});
      );
      out body;
    `;

      try {
        const response = await fetch(
          "https://overpass-api.de/api/interpreter",
          {
            method: "POST",
            body: query,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received data:", data);

        // Transform the Overpass nodes to SpotInterface
        const transformedNodes = data.elements.map(transformOverpassNode);

        setNodes(transformedNodes);
      } catch (error) {
        console.error("Error fetching unverified nodes:", error);
        setError("Failed to fetch nodes. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const adjustBoundsForZoom = (
    bounds: L.LatLngBounds,
    zoom: number
  ): L.LatLngBounds => {
    const center = bounds.getCenter();
    const latDelta = bounds.getNorth() - bounds.getSouth();
    const lngDelta = bounds.getEast() - bounds.getWest();

    // Adjust the radius based on zoom level
    const minZoom = 5; // Minimum zoom level
    const maxZoom = 18; // Maximum zoom level

    // Normalize zoom level between 0 and 1
    const normalizedZoom = (zoom - minZoom) / (maxZoom - minZoom);

    // Ensure normalizedZoom is within [0,1]
    const clampedZoom = Math.max(0, Math.min(1, normalizedZoom));

    // Use an exponential function for smoother scaling
    const radiusMultiplier = 0.1 + 0.9 * Math.pow(clampedZoom, 2);

    const newLatDelta = latDelta * radiusMultiplier;
    const newLngDelta = lngDelta * radiusMultiplier;

    return L.latLngBounds(
      [center.lat - newLatDelta / 2, center.lng - newLngDelta / 2],
      [center.lat + newLatDelta / 2, center.lng + newLngDelta / 2]
    );
  };

  const debouncedFetchNodes = useCallback(() => {
    const now = Date.now();
    if (now - lastFetchRef.current > 2000) {
      lastFetchRef.current = now;
      const zoom = map.getZoom();
      console.log("Current zoom level:", zoom);
      if (zoom >= 14) {
        console.log("Fetching nodes...");
        fetchNodes(map.getBounds(), zoom);
      } else {
        console.log("Clearing nodes due to low zoom level");
        setNodes([]);
      }
    }
  }, [fetchNodes, map]);

  useEffect(() => {
    console.log("Setting up map event listeners");
    debouncedFetchNodes();
    map.on("moveend", debouncedFetchNodes);
    map.on("zoomend", debouncedFetchNodes);

    return () => {
      console.log("Cleaning up map event listeners");
      map.off("moveend", debouncedFetchNodes);
      map.off("zoomend", debouncedFetchNodes);
    };
  }, [map, debouncedFetchNodes]);

  console.log("Rendering UnverifiedSpotsLayer, number of nodes:", nodes.length);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <MarkerClusterGroup
      chunkedLoading
      maxClusterRadius={60}
      spiderfyOnMaxZoom={false}
      disableClusteringAtZoom={16}
    >
      {nodes.map((node) => (
        <Marker
          key={node.id}
          position={[node.lat, node.lng]}
          icon={L.divIcon({
            className: "unverified-node-marker",
            html: node.category.icon,
            iconSize: [50, 50],
            iconAnchor: [12, 24],
          })}
          eventHandlers={{
            click: () => onNodeClick(node),
          }}
        >
          <Popup>
            <div className="text-sm">
              <p>Name: {node.name}</p>
              <p>Category: {node.category.name}</p>
              <p>Tags: {node.tags?.join(", ")}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
};

export default UnverifiedSpotsLayer;
