import { Place } from "@/src/types/custom.types";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "../ui/drawer";
import PlaceInfoContent from "./PlaceInfoContent";
import PlaceInfoFooter from "./PlaceInfoFooter";
import PlaceInfoHeader from "./PlaceInfoHeader";

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
        <DrawerHeader>
          <PlaceInfoHeader place={place} />
        </DrawerHeader>
        <PlaceInfoContent place={place} />
        <DrawerFooter>
          <PlaceInfoFooter />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
