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
        <VerifiedSpotsLayer
          key={refreshKey}
          isAdmin={false}
          user={null}
          onSpotClick={handleSpotClick}
        />
      )}
      {currentMode === "contribute" && (
        <UnverifiedSpotsLayer onNodeClick={handleUnverifiedNodeClick} />
      )}
    </>
  );
}

export default SpotsLayer;
