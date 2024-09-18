import React, { useEffect, useState, useCallback, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { pb } from "@/lib/db";

interface UnverifiedSpot {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    amenity?: string;
    [key: string]: string | undefined;
  };
}

interface UnverifiedSpotsLayerProps {
  onNodeClick: (node: UnverifiedSpot) => void;
}

const UnverifiedSpotsLayer: React.FC<UnverifiedSpotsLayerProps> = ({
  onNodeClick,
}) => {
  const [nodes, setNodes] = useState<UnverifiedSpot[]>([]);
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

      const query = `
      [out:json][timeout:25];
      (
        node["amenity"="toilets"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
        node["wheelchair"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
        node["tactile_paving"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
        node["hearing_impaired:induction_loop"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
        node["amenity"="parking"]["disabled"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
      );
      out body;
    `;

      console.log("Fetching nodes with query:", query);

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

        // Extract OSM IDs from the fetched nodes
        const osmIds = data.elements.map((node: UnverifiedSpot) => node.id);

        // Fetch existing node IDs from your database
        const existingNodeIds = await fetchExistingNodeIds(osmIds);

        // Filter out nodes that already exist in your database
        const filteredNodes = data.elements.filter(
          (node: UnverifiedSpot) => !existingNodeIds.has(node.id)
        );

        setNodes(filteredNodes);
        console.log("Number of unverified nodes set:", filteredNodes.length);
      } catch (error) {
        console.error("Error fetching unverified nodes:", error);
        setError("Failed to fetch nodes. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

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
          position={[node.lat, node.lon]}
          icon={L.divIcon({
            className: "unverified-node-marker",
            html: "📍",
            iconSize: [25, 25],
            iconAnchor: [12, 24],
          })}
          eventHandlers={{
            click: () => onNodeClick(node),
          }}
        ></Marker>
      ))}
    </MarkerClusterGroup>
  );
};

export default UnverifiedSpotsLayer;
