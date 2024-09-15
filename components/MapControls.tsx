import ZoomButtons from './ZoomButtons';

interface MapControlsProps {
  showListView: boolean;
}

function MapControls({ showListView }: MapControlsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute bottom-4 right-4 z-[1000] pointer-events-auto">
        <ZoomButtons showListView={showListView} />
        {/* Add other control components here as needed */}
      </div>
    </div>
  );
}

export default MapControls;