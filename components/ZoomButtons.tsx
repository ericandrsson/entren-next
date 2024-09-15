import { useCallback } from "react";
import { useMapEvents } from "react-leaflet";

const MIN_ZOOM = 3;
const MAX_ZOOM = 18;

function ZoomButtons() {
  const map = useMapEvents({});

  const handleZoom = useCallback(
    (delta: number, e: React.MouseEvent) => {
      e.stopPropagation();
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
    <div className="flex flex-col space-y-2">
      <button
        onClick={(e) => handleZoom(1, e)}
        className="bg-white text-gray-700 border-2 border-gray-300 rounded-full w-16 h-16 flex items-center justify-center text-xl shadow-lg hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
      >
        +
      </button>
      <button
        onClick={(e) => handleZoom(-1, e)}
        className="bg-white text-gray-700 border-2 border-gray-300 rounded-full w-16 h-16 flex items-center justify-center text-xl shadow-lg hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
      >
        -
      </button>
    </div>
  );
}

export default ZoomButtons;
