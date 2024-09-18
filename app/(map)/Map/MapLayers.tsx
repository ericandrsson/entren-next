import { TileLayer } from "react-leaflet";
import VerifiedSpotsLayer from "../SpotLayers/VerifiedSpotsLayer";
import UnverifiedSpotsLayer from "../SpotLayers/UnverifiedSpotsLayer";
import VerifiedSpotsMarker from "../SpotLayers/VerifiedSpotsMarker";
import { useMapContext } from "./MapContext";

function MapLayers() {
  const {
    isDetailed,
    currentMode,
    refreshKey,
    handleSpotClick,
    handleUnverifiedNodeClick,
    tempSpot,
  } = useMapContext();

  const tileLayerUrl = isDetailed
    ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";

  return (
    <>
      <TileLayer
        url={tileLayerUrl}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        noWrap={true}
      />
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
      {tempSpot && (
        <VerifiedSpotsMarker
          spot={tempSpot}
          isTemporary={true}
          categories={[]}
        />
      )}
    </>
  );
}

export default MapLayers;
