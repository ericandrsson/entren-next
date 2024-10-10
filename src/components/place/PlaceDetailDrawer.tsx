import { Place } from "@/src/types/custom.types";
import PlaceDetail from "../PlaceDetail";
import { Drawer, DrawerContent } from "../ui/drawer";

export default function PlaceDetailDrawer({
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
      <DrawerContent>
        <div className="p-4">
          <PlaceDetail place={place} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
