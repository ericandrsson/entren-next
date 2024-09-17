import ZoomButtons from "./ZoomButtons";
import MapDetailToggle from "./MapDetailToggle";
import SearchBar from "./SearchBar";

interface MapControlsProps {
  showListView: boolean;
  isDetailed: boolean;
  onDetailToggle: () => void;
  onSelectPlace: (result: SearchResult) => void;
}

function MapControls({
  showListView,
  isDetailed,
  onDetailToggle,
  onSelectPlace,
}: MapControlsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-4 left-4 z-[1000] pointer-events-auto">
        <SearchBar onSelectPlace={onSelectPlace} />
      </div>
      <div className="absolute top-4 right-4 z-[1000]">
        <MapDetailToggle isDetailed={isDetailed} onToggle={onDetailToggle} />
      </div>
      <div className="absolute bottom-4 right-4 z-[1000] hidden sm:block">
        <ZoomButtons showListView={showListView} />
      </div>
    </div>
  );
}

export default MapControls;
