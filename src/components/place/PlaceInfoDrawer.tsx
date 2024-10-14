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
      <DrawerContent className="flex flex-col max-h-[calc(100vh-4rem)]">
        <DrawerHeader className="px-4 py-2">
          <PlaceInfoHeader place={place} />
        </DrawerHeader>
        <div className="flex-grow overflow-hidden">
          <PlaceInfoContent place={place} />
        </div>
        <DrawerFooter className="px-4 py-2">
          <PlaceInfoFooter />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
