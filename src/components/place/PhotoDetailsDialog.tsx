import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import Image from "next/image";
import { PlaceEntranceImage } from "../../types/custom.types";

interface PhotoDialogProps {
  photo: PlaceEntranceImage | null;
  onClose: () => void;
}

export function PhotoDialog({ photo, onClose }: PhotoDialogProps) {
  return (
    <Dialog open={!!photo} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Photo Details</DialogTitle>
          <DialogDescription>
            {photo?.description || "Ingen beskrivning finns"}
          </DialogDescription>
        </DialogHeader>
        {photo && (
          <Image
            src={photo.image_url!}
            alt={photo.description || ""}
            width={800}
            height={600}
            className="rounded-md object-contain max-w-[800px] max-h-[600px] w-full"
          />
        )}
        <Button onClick={onClose} className="mt-4">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
