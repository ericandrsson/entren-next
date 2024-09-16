import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { pb } from "@/lib/db";

interface Spot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: {
    id: string;
    name: string;
    icon: string;
  };
  created: string;
  description?: string;
  tags?: string[];
  user: string;
  isVerified: boolean;
  image?: string;
}

interface SpotDetailsSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  spot: Spot | null;
}

function SpotDetailsSheet({ isOpen, onOpenChange, spot }: SpotDetailsSheetProps) {
  if (!spot) return null;

  const getImageUrl = (imageFilename: string) => {
    return `${pb.baseUrl}/api/files/spots/${spot.id}/${imageFilename}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[400px] sm:w-[540px] max-w-[100vw] bg-white text-gray-800 flex flex-col h-full p-0 overflow-hidden"
      >
        <SheetHeader className="p-6 flex-shrink-0">
          <SheetTitle className="text-2xl font-bold text-gray-900">
            {spot.name}
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            {spot.category.icon} {spot.category.name}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow overflow-y-auto px-6">
          {spot.image && (
            <div className="mb-6">
              <img
                src={getImageUrl(spot.image)}
                alt={spot.name}
                className="rounded-lg object-cover w-full h-auto"
              />
            </div>
          )}
          {spot.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p>{spot.description}</p>
            </div>
          )}
          {spot.tags && spot.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {spot.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Details</h3>
            <p>Created: {new Date(spot.created).toLocaleDateString()}</p>
            <p>Verified: {spot.isVerified ? "Yes" : "No"}</p>
          </div>
        </div>
        <SheetFooter className="p-6 bg-white border-t flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default SpotDetailsSheet;