import React from "react";
import { Button } from "@/src/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Map as LeafletMap } from "leaflet";

interface ZoomButtonsProps {
  map: LeafletMap;
}

function ZoomButtons({ map }: ZoomButtonsProps) {
  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="flex flex-col gap-2 pointer-events-auto">
      <Button
        onClick={handleZoomIn}
        variant="outline"
        size="icon"
        className="bg-white text-black backdrop-blur-sm h-10 w-10 hover:bg-white/80 transition-colors duration-200"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        onClick={handleZoomOut}
        variant="outline"
        size="icon"
        className="bg-white text-black backdrop-blur-sm h-10 w-10 hover:bg-white/80 transition-colors duration-200"
      >
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default ZoomButtons;
