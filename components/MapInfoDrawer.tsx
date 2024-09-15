import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LatLng } from "leaflet";

interface MapInfoDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  markerPosition: LatLng | null;
}

function MapInfoDrawer({ isOpen, onOpenChange, markerPosition }: MapInfoDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] z-[1000]">
        <SheetHeader>
          <SheetTitle>Add Information</SheetTitle>
          <SheetDescription>Enter details about this location.</SheetDescription>
        </SheetHeader>
        <div className="py-4">
          {markerPosition && (
            <p>
              Latitude: {markerPosition.lat.toFixed(6)}, Longitude: {markerPosition.lng.toFixed(6)}
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

export default MapInfoDrawer;