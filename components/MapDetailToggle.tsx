import { Button } from "@/components/ui/button";
import { MapIcon } from "lucide-react";

interface MapDetailToggleProps {
  isDetailed: boolean;
  onToggle: () => void;
}

function MapDetailToggle({ isDetailed, onToggle }: MapDetailToggleProps) {
  return (
    <div className="absolute top-4 right-4 z-[1000] pointer-events-auto">
      <Button
        onClick={onToggle}
        variant="outline"
        size="sm"
        className="bg-white text-black backdrop-blur-sm h-10 px-4 hover:bg-white/80 transition-colors duration-200"
      >
        <MapIcon className="mr-2 h-4 w-4" />
        {isDetailed ? "Simple" : "Detailed"}
      </Button>
    </div>
  );
}

export default MapDetailToggle;
