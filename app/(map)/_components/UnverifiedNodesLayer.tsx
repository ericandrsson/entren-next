import React, { useEffect, useState, useCallback, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { latLngToTile, tileToLatLng } from "../utils/tileUtils";

interface UnverifiedNode {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    amenity?: string;
    [key: string]: string | undefined;
  };
}

interface UnverifiedNodesLayerProps {
  onNodeClick: (node: UnverifiedNode) => void;
}

const UnverifiedNodesLayer: React.FC<UnverifiedNodesLayerProps> = ({
  onNodeClick,
}) => {
  const [nodes, setNodes] = useState<UnverifiedNode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const map = useMap();
  const lastFetchRef = useRef<number>(0);

  const fetchNodes = useCallback(
    async (bounds: L.LatLngBounds, zoom: number) => {
      if (isLoading || zoom < 14) return;

      setIsLoading(true);
      setError(null);

      const nw = latLngToTile(bounds.getNorth(), bounds.getWest(), zoom);
      const se = latLngToTile(bounds.getSouth(), bounds.getEast(), zoom);

      const minX = Math.min(nw.x, se.x);
      const maxX = Math.max(nw.x, se.x);
      const minY = Math.min(nw.y, se.y);
      const maxY = Math.max(nw.y, se.y);

      const query = `
      [out:json][timeout:25];
      (
        node["shop"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
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
        setNodes(data.elements);
        console.log("Number of nodes set:", data.elements.length);
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

  console.log("Rendering UnverifiedNodesLayer, number of nodes:", nodes.length);

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
        >
          <Popup>
            <div>
              <h3>{node.tags.name || "Unnamed Place"}</h3>
              <p>{node.tags.amenity || node.tags.shop || "Unknown type"}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
};

export default UnverifiedNodesLayer;
