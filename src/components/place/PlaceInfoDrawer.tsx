import { Place } from "@/src/types/custom.types";
import { Drawer, DrawerContent } from "../ui/drawer";
import PlaceInfo from "./PlaceInfo";

export default function PlaceInfoDrawer({
  place,
  isOpen,
  onClose,
}: {
  place: Place;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-white">
        <div className="p-4">
          <PlaceInfo place={place} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
