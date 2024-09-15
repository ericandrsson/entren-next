import ZoomButtons from "./ZoomButtons";
import MapDetailToggle from "./MapDetailToggle";

interface MapControlsProps {
  showListView: boolean;
  isDetailed: boolean;
  onDetailToggle: () => void;
}

function MapControls({
  showListView,
  isDetailed,
  onDetailToggle,
}: MapControlsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <MapDetailToggle isDetailed={isDetailed} onToggle={onDetailToggle} />
      <ZoomButtons showListView={showListView} />
    </div>
  );
}

export default MapControls;
