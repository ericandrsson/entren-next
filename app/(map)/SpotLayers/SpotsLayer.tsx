import React from "react";
import VerifiedSpotsMarker from "./VerifiedSpotsMarker";
import SpotSheetContent from "./SpotSheetContent";
import { useSpotsStore } from "@/app/lib/spotStore";

function SpotsLayer() {
  const spots = useSpotsStore((state) => state.spots);
  const selectedSpot = useSpotsStore((state) => state.selectedSpot);
  const isSheetOpen = useSpotsStore((state) => state.isSheetOpen);
  const closeSpotSheet = useSpotsStore((state) => state.closeSpotSheet);

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
