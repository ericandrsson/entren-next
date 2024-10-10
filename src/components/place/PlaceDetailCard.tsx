import { Card } from "@/src/components/ui/card";
import { useStore } from "@/src/libs/store";
import { X } from "lucide-react";
import { Place } from "../../types/custom.types";
import PlaceDetailInfo from "./PlaceDetailInfo";

export default function PlaceDetailCard({ place }: { place: Place }) {
  const { setSelectedPlace } = useStore();

  return (
    <Card className="w-full max-w-3xl mx-auto relative">
      <div className="flex justify-end p-2 pb-0">
        <button
          onClick={() => setSelectedPlace(null)}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      <PlaceDetailInfo place={place} />
    </Card>
  );
}
