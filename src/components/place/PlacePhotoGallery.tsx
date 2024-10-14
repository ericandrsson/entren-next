import { Button } from "@/src/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PlaceEntranceImage } from "../../types/custom.types";

interface PlacePhotoGalleryProps {
  photos: PlaceEntranceImage[];
  initialPhotoIndex: number;
}

export default function PlacePhotoGallery({
  photos,
  initialPhotoIndex,
}: PlacePhotoGalleryProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(initialPhotoIndex);

  const handlePrevious = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : photos.length - 1,
    );
  };

  const handleNext = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex < photos.length - 1 ? prevIndex + 1 : 0,
    );
  };

  if (photos.length === 0) {
    return <div>Inga bilder finns tillgängliga</div>;
  }

  const currentPhoto = photos[currentPhotoIndex];

  return (
    <div className="relative">
      <div className="flex justify-center items-center">
        <Image
          src={currentPhoto.photo_filename!}
          alt={currentPhoto.description || ""}
          width={800}
          height={600}
          className="rounded-md object-contain max-h-[600px]"
        />
      </div>
      <Button
        variant="ghost"
        className="absolute left-2 top-1/2 transform -translate-y-1/2"
        onClick={handlePrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        className="absolute right-2 top-1/2 transform -translate-y-1/2"
        onClick={handleNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
      <div className="text-center mt-2">
        {currentPhoto.description && <p>{currentPhoto.description}</p>}
        <p className="text-sm text-muted-foreground">
          Bild {currentPhotoIndex + 1} av {photos.length}
        </p>
      </div>
    </div>
  );
}
