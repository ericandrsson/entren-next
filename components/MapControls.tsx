import ZoomButtons from './ZoomButtons';

interface MapControlsProps {
  showListView: boolean;
}

function MapControls({ showListView }: MapControlsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <ZoomButtons showListView={showListView} />
      {/* Add other control components here as needed */}
    </div>
  );
}

export default MapControls;