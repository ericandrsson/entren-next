import ZoomButtons from "./ZoomButtons";

interface MapControlsProps {
  showListView: boolean;
}

function MapControls({ showListView }: MapControlsProps) {
  const handleControlClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div
        className="absolute bottom-12 right-12 z-[1000] pointer-events-auto"
        onClick={handleControlClick}
      >
        <ZoomButtons showListView={showListView} />
        {/* Add other control components here as needed */}
      </div>
    </div>
  );
}

export default MapControls;
