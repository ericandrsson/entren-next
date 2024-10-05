import React from "react";
import VerifiedSpotsMarker from "./VerifiedSpotsMarker";
import SpotSheetContent from "./SpotSheetContent";
import { useStore } from "@/src/app/lib/store";

function SpotsLayer() {
  const spots = useStore((state) => state.spots);
  const selectedSpot = useStore((state) => state.selectedSpot);
  const isSheetOpen = useStore((state) => state.isSheetOpen);
  const closeSpotSheet = useStore((state) => state.closeSpotSheet);

  return (
    <>
      {spots.map((spot) => (
        <VerifiedSpotsMarker key={spot.id} spot={spot} />
      ))}
      <SpotSheetContent
        spot={selectedSpot}
        isOpen={isSheetOpen}
        onClose={closeSpotSheet}
      />
    </>
  );
}

export default SpotsLayer;
