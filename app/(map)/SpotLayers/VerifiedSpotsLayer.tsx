import React, { useEffect, useState, useCallback } from "react";
import { useMap } from "react-leaflet";
import { LatLngBounds } from "leaflet";
import { pb } from "@/lib/db";
import VerifiedSpotsMarker from "./VerifiedSpotsMarker";
import MarkerClusterGroup from "react-leaflet-cluster";

interface Spot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: {
    id: string;
    name: string;
    icon: string;
  };
  created: string;
  description?: string;
  user: string;
  isVerified: boolean;
}

interface VerifiedSpotsLayerProps {
  onSpotClick: (spot: Spot) => void;
}

const VerifiedSpotsLayer: React.FC<VerifiedSpotsLayerProps> = ({
  onSpotClick,
}) => {
  const [spots, setSpots] = useState<Spot[]>([]);
  const map = useMap();

  const fetchSpots = useCallback(
    async (bounds: LatLngBounds) => {
      try {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        let filter = `lat >= ${sw.lat} && lat <= ${ne.lat} && lng >= ${sw.lng} && lng <= ${ne.lng}`;

        const currentZoom = map.getZoom();
        const limit = currentZoom < 5 ? 100 : 1000;

        const result = await pb.collection("spots").getList<Spot>(1, limit, {
          filter: filter,
          sort: "-created",
          expand: "category",
        });

        console.log("Fetched spots:", result.items);

        setSpots(result.items);
      } catch (error) {
        console.error("Error fetching spots:", error);
      }
    },
    [map]
  );

  useEffect(() => {
    const handleMoveEnd = () => {
      fetchSpots(map.getBounds());
    };

    map.on("moveend", handleMoveEnd);
    fetchSpots(map.getBounds());

    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [map, fetchSpots]);

  return (
    <MarkerClusterGroup
      chunkedLoading
      maxClusterRadius={60}
      spiderfyOnMaxZoom={false}
      disableClusteringAtZoom={16}
    >
      {spots.map((spot) => (
        <VerifiedSpotsMarker
          key={spot.id}
          spot={spot}
          onClick={() => onSpotClick(spot)}
        />
      ))}
    </MarkerClusterGroup>
  );
};

export default VerifiedSpotsLayer;
