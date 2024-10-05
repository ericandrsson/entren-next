import React from "react";
import VerifiedSpotsMarker from "./VerifiedSpotsMarker";
import SpotSheetContent from "./SpotSheetContent";
import { useStore } from "@/src/app/lib/store";
import MarkerClusterGroup from 'react-leaflet-cluster';

function SpotsLayer() {
  const spots = useStore((state) => state.spots);
  const selectedSpot = useStore((state) => state.selectedSpot);
  const isSheetOpen = useStore((state) => state.isSheetOpen);
  const closeSpotSheet = useStore((state) => state.closeSpotSheet);

  return (
    <>
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={60}
        spiderfyOnMaxZoom={true}
        polygonOptions={{
          fillColor: '#ffffff',
          color: '#3388ff',
          weight: 4,
          opacity: 1,
          fillOpacity: 0.7
        }}
      >
        {spots.map((spot) => (
          <VerifiedSpotsMarker key={spot.id} spot={spot} />
        ))}
      </MarkerClusterGroup>
      <SpotSheetContent
        spot={selectedSpot}
        isOpen={isSheetOpen}
        onClose={closeSpotSheet}
      />
    </>
  );
}

export default SpotsLayer;
