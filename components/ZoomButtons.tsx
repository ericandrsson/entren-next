import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useMap } from "react-leaflet";

interface ZoomButtonsProps {
  showListView: boolean;
}

function ZoomButtons({ showListView }: ZoomButtonsProps) {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="absolute bottom-4 right-4 z-[1000] pointer-events-auto flex flex-col gap-2 sm:right-4 right-2">
      <Button
        onClick={handleZoomIn}
        variant="outline"
        size="icon"
        className="bg-white text-black backdrop-blur-sm h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/80 transition-colors duration-200"
      >
        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
      <Button
        onClick={handleZoomOut}
        variant="outline"
        size="icon"
        className="bg-white text-black backdrop-blur-sm h-8 w-8 sm:h-10 sm:w-10 hover:bg-white/80 transition-colors duration-200"
      >
        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    </div>
  );
}

export default ZoomButtons;
