import { Place } from "@/src/types/custom.types";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "../ui/drawer";
import PlaceInfoContent, { handleAddEntrance } from "./PlaceInfoContent";
import PlaceInfoFooter from "./PlaceInfoFooter";
import PlaceInfoHeader from "./PlaceInfoHeader";
import { useState } from "react";
import { useStore } from "@/src/libs/store";

export default function PlaceInfoDrawer({
  place,
  isOpen,
  onClose,
}: {
  place: Place;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [entranceCount, setEntranceCount] = useState(0);
  const { 
    setIsAddEntranceDialogOpen, 
    setIsLoginPromptOpen, 
    isUserAuthenticated 
  } = useStore();

  const handleAddEntranceClick = () => {
    if (isUserAuthenticated) {
      setIsAddEntranceDialogOpen(true);
    } else {
      setIsLoginPromptOpen(true);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="flex flex-col max-h-[calc(100vh-4rem)]">
        <DrawerHeader className="px-4 py-2">
          <PlaceInfoHeader place={place} />
        </DrawerHeader>
        <div className="flex-grow overflow-hidden">
          <PlaceInfoContent 
            place={place} 
            onEntranceCountChange={(count) => setEntranceCount(count)}
          />
        </div>
        <DrawerFooter className="px-4 py-2">
          <PlaceInfoFooter
            place={place}
            entranceCount={entranceCount}
            onAddEntrance={handleAddEntranceClick}
          />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
