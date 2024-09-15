import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LatLng } from "leaflet";

interface MapInfoSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  markerPosition: LatLng | null;
}

function MapInfoSheet({
  isOpen,
  onOpenChange,
  markerPosition,
}: MapInfoSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent 
        side="left" 
        className="w-[400px] sm:w-[540px] max-w-[100vw] bg-white z-[9999]"
      >
        <SheetHeader>
          <SheetTitle>Add Information</SheetTitle>
          <SheetDescription>
            Enter details about this location.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          {markerPosition && (
            <p>
              Latitude: {markerPosition.lat.toFixed(6)}, Longitude:{" "}
              {markerPosition.lng.toFixed(6)}
            </p>
          )}
          {/* Add more input fields here as needed */}
        </div>
        <SheetFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default MapInfoSheet;
