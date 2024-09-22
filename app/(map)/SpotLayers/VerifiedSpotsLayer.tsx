import React, { useEffect } from "react";
import { useMap } from "react-leaflet";
import VerifiedSpotsMarker from "./VerifiedSpotsMarker";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useMapStore } from "../Map/MapStore";

interface VerifiedSpotsLayerProps {
  onSpotClick: (spot: Spot) => void;
}

const VerifiedSpotsLayer: React.FC<VerifiedSpotsLayerProps> = ({
  onSpotClick,
}) => {
  const map = useMap();
  const { spots, debouncedFetchSpots } = useMapStore();

  useEffect(() => {
    const handleMoveEnd = () => {
      debouncedFetchSpots(map.getBounds());
    };

    map.on("moveend", handleMoveEnd);
    debouncedFetchSpots(map.getBounds());

    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [map, debouncedFetchSpots]);

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
