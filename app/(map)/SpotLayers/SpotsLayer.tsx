import { useMapStore } from "../Map/MapStore";
import UnverifiedSpotsLayer from "./UnverifiedSpotsLayer";
import VerifiedSpotsLayer from "./VerifiedSpotsLayer";

function SpotsLayer() {
  const {
    currentMode,
    refreshKey,
    handleSpotClick,
    handleUnverifiedNodeClick,
  } = useMapStore();

  return (
    <>
      {currentMode === "view" && (
        <VerifiedSpotsLayer key={refreshKey} onSpotClick={handleSpotClick} />
      )}
      {currentMode === "contribute" && (
        <UnverifiedSpotsLayer onNodeClick={handleUnverifiedNodeClick} />
      )}
    </>
  );
}

export default SpotsLayer;
