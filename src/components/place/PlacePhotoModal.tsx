import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { PlaceEntranceImage } from "../../types/custom.types";
import PlacePhotoGallery from "./PlacePhotoGallery";

interface PlacePhotoModalProps {
  photos: PlaceEntranceImage[];
  initialPhotoIndex: number;
  onClose: () => void;
  isOpen: boolean;
}

export default function PlacePhotoModal({
  photos,
  initialPhotoIndex,
  onClose,
  isOpen,
}: PlacePhotoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <VisuallyHidden.Root>
            <DialogTitle>Bilddetaljer</DialogTitle>
            <DialogDescription>
              Galleri med bilder från entréerna till platsen
            </DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>
        <PlacePhotoGallery
          photos={photos}
          initialPhotoIndex={initialPhotoIndex}
        />
        <Button onClick={onClose} className="mt-4">
          Stäng
        </Button>
      </DialogContent>
    </Dialog>
  );
}
