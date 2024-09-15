import { useCallback } from 'react';
import { useMapEvents } from 'react-leaflet';

const MIN_ZOOM = 3;
const MAX_ZOOM = 18;

interface ZoomButtonsProps {
  showListView: boolean;
}

function ZoomButtons({ showListView }: ZoomButtonsProps) {
  const map = useMapEvents({});

  const handleZoom = useCallback(
    (delta: number) => {
      const currentZoom = map.getZoom();
      const newZoom = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, currentZoom + delta)
      );
      map.setZoom(newZoom);
    },
    [map]
  );

  return (
    <div
      className={`absolute bottom-4 right-4 z-[1001] flex flex-col space-y-2 transition-all duration-300 ease-in-out ${
        showListView ? "mr-80" : ""
      }`}
    >
      <button
        onClick={() => handleZoom(1)}
        className="bg-white text-gray-700 border-2 border-gray-300 rounded-full w-16 h-16 flex items-center justify-center text-xl shadow-lg hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
      >
        +
      </button>
      <button
        onClick={() => handleZoom(-1)}
        className="bg-white text-gray-700 border-2 border-gray-300 rounded-full w-16 h-16 flex items-center justify-center text-xl shadow-lg hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
      >
        -
      </button>
    </div>
  );
}

export default ZoomButtons;