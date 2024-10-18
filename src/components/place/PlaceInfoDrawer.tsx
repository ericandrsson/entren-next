import { Entrance, EntrancePhoto, Place } from "@/src/types/custom.types";
import { useState } from "react";
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
  entrances,
  allPlacePhotos,
  isLoading,
  isOpen,
  onClose,
  onAddEntrance,
}: {
  place: Place;
  entrances: Entrance[];
  allPlacePhotos: EntrancePhoto[];
  isLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  onAddEntrance: () => void;
}) {
  const [entranceCount, setEntranceCount] = useState(entrances.length);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="flex flex-col max-h-[calc(100vh-4rem)]">
        <DrawerHeader className="px-4 py-2">
          <PlaceInfoHeader place={place} />
        </DrawerHeader>
        <div className="flex-grow overflow-hidden">
          <PlaceInfoContent
            place={place}
            entrances={entrances}
            allPlacePhotos={allPlacePhotos}
            isLoading={isLoading}
            onEntranceCountChange={(count) => setEntranceCount(count)}
          />
        </div>
        <DrawerFooter className="px-4 py-2">
          <PlaceInfoFooter
            place={place}
            entranceCount={entranceCount}
            onAddEntrance={onAddEntrance}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
