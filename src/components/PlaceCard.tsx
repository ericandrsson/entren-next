import { useStore } from "@/src/libs/store";
import { Place } from "@/src/types/custom.types";

interface PlaceCardProps {
  place: Place;
}

export default function PlaceCard({ place }: PlaceCardProps) {
  const openPlaceSheet = useStore((state) => state.openPlaceSheet);

  return (
    <div
      className="flex bg-white shadow rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300 w-full"
      onClick={() => openPlaceSheet(place)}
    >
      <div className="w-1/3 h-32 flex-shrink-0 overflow-hidden">
        {/* Temporarily hiding the image
        <Image
          src={getPlaceImageUrl(place.image, place.id) || "/placeholder.png"}
          alt={place.name}
          fill
          className="object-cover"
        />
        */}
      </div>

      <div className="p-4 flex flex-col justify-between flex-grow w-2/3">
        <div>
          <h3 className="font-semibold text-lg mb-1">{place.name}</h3>
          <p className="text-sm text-gray-600 mb-2">
            Address not yet available
          </p>
        </div>
      </div>
    </div>
  );
}
