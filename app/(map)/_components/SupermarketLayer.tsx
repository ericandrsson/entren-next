import React, { useEffect, useState, useCallback } from "react";
import { useMap } from "react-leaflet";
import { LatLngBounds } from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import SpotMarker from "./SpotMarker";

interface Supermarket {
  id: number;
  lat: number;
  lon: number;
  tags: {
    name?: string;
    brand?: string;
    shop?: string;
  };
}

const SupermarketLayer: React.FC = () => {
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const map = useMap();

  const fetchSupermarkets = useCallback(
    async (bounds: LatLngBounds) => {
      try {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        const query = `
          [out:json];
          (
            node["shop"="supermarket"](${sw.lat},${sw.lng},${ne.lat},${ne.lng});
            way["shop"="supermarket"](${sw.lat},${sw.lng},${ne.lat},${ne.lng});
            relation["shop"="supermarket"](${sw.lat},${sw.lng},${ne.lat},${ne.lng});
          );
          out center;
        `;

        const response = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: query,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched supermarket data:", data); // Add this line

        const supermarketData: Supermarket[] = data.elements.map((element: any) => ({
          id: element.id,
          lat: element.lat || element.center.lat,
          lon: element.lon || element.center.lon,
          tags: element.tags,
        }));

        console.log("Processed supermarket data:", supermarketData); // Add this line
        setSupermarkets(supermarketData);
      } catch (error) {
        console.error("Error fetching supermarkets:", error);
      }
    },
    [map]
  );

  useEffect(() => {
    const handleMoveEnd = () => {
      fetchSupermarkets(map.getBounds());
    };

    map.on("moveend", handleMoveEnd);
    fetchSupermarkets(map.getBounds());

    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [map, fetchSupermarkets]);

  return (
    <MarkerClusterGroup
      chunkedLoading
      maxClusterRadius={60}
      spiderfyOnMaxZoom={false}
      disableClusteringAtZoom={16}
    >
      {supermarkets.map((supermarket) => {
        console.log("Rendering supermarket:", supermarket); // Add this line
        return (
          <SpotMarker
            key={supermarket.id}
            spot={{
              id: supermarket.id.toString(),
              name: supermarket.tags.name || supermarket.tags.brand || "Unnamed Supermarket",
              lat: supermarket.lat,
              lng: supermarket.lon,
              category: { id: "supermarket", name: "Supermarket", icon: "🛒" },
              created: new Date().toISOString(),
              user: "",
              isVerified: true,
            }}
            categories={[]}
            onClick={() => console.log("Supermarket clicked:", supermarket)}
          />
        );
      })}
    </MarkerClusterGroup>
  );
};

export default SupermarketLayer;