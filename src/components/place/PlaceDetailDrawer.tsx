import { Place } from "@/src/types/custom.types";
import { Drawer, DrawerContent } from "../ui/drawer";
import PlaceDetailInfo from "./PlaceDetailInfo";

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
      <DrawerContent className="bg-white">
        <div className="p-4">
          <PlaceDetailInfo place={place} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
