import { Button } from "@/components/ui/button";
import { MapIcon } from "lucide-react";

interface MapDetailToggleProps {
  isDetailed: boolean;
  onToggle: () => void;
}

function MapDetailToggle({ isDetailed, onToggle }: MapDetailToggleProps) {
  return (
    <div className="absolute top-4 right-4 z-[1000] pointer-events-auto sm:right-4 right-2">
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className="bg-white text-black backdrop-blur-sm h-8 px-2 sm:h-10 sm:px-4 hover:bg-white/80 transition-colors duration-200"
      >
        <MapIcon className="mr-1 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
        <span className="text-xs sm:text-sm">{isDetailed ? "Simple" : "Detailed"}</span>
      </Button>
    </div>
  );
}

export default MapDetailToggle;
