import React from "react";
import Image from "next/image";
import { getImageUrl } from "@/app/lib/spots";
import { Spot } from "@/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface SpotSheetContentProps {
  spot: Spot | null;
  isOpen: boolean;
  onClose: () => void;
}

function SpotSheetContent({ spot, isOpen, onClose }: SpotSheetContentProps) {
  if (!spot) return null;
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>{spot.name}</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col items-center gap-4 text-center mt-4">
          <div className="w-full max-w-64 h-64 relative rounded-lg overflow-hidden shadow-md">
            <Image
              src={getImageUrl(spot.image, spot.id) || "/placeholder.png"}
              alt={spot.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-base">
            <p className="text-gray-700">{spot.address}</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default SpotSheetContent;
