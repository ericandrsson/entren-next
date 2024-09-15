import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MapInfoDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  markerPosition: L.LatLng | null;
}

export default function MapInfoDrawer({
  isOpen,
  onOpenChange,
  markerPosition,
}: MapInfoDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[400px] sm:w-[540px] border-r p-0 bg-white dark:bg-gray-800"
      >
        <div className="h-full flex flex-col">
          <SheetHeader className="flex justify-between items-center p-4 border-b">
            <SheetTitle>Location Information</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetHeader>
          <div className="flex-1 overflow-auto p-4">
            {markerPosition && (
              <p className="mb-4">
                Latitude: {markerPosition.lat.toFixed(6)}, Longitude:{" "}
                {markerPosition.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
