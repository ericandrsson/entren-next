import { Button } from "@/src/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PlaceEntranceImage } from "../../types/custom.types";

interface PlacePhotoGalleryProps {
  photos: PlaceEntranceImage[];
  initialPhotoIndex: number;
}

export default function PlacePhotoGallery({ photos, initialPhotoIndex }: PlacePhotoGalleryProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(initialPhotoIndex);

  const handlePrevious = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : photos.length - 1));
  };

  const handleNext = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex < photos.length - 1 ? prevIndex + 1 : 0));
  };

  if (photos.length === 0) {
    return <div>Inga bilder finns tillgängliga</div>;
  }

  const currentPhoto = photos[currentPhotoIndex];

  return (
    <div className="relative">
      <div className="flex items-center justify-center">
        <Image
          src={currentPhoto.photo_filename!}
          alt={currentPhoto.description || ""}
          width={800}
          height={600}
          className="max-h-[600px] rounded-md object-contain"
        />
      </div>
      <Button variant="ghost" className="absolute left-2 top-1/2 -translate-y-1/2 transform" onClick={handlePrevious}>
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 transform" onClick={handleNext}>
        <ChevronRight className="h-6 w-6" />
      </Button>
      <div className="mt-2 text-center">
        {currentPhoto.description && <p>{currentPhoto.description}</p>}
        <p className="text-sm text-muted-foreground">
          Bild {currentPhotoIndex + 1} av {photos.length}
        </p>
      </div>
    </div>
  );
}
