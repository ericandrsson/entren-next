import { useStore } from "@/src/libs/store";
import { Place } from "@/src/types/custom.types";

export default function ListViewCard({ place }: { place: Place }) {
  const { setSelectedPlace } = useStore();

  return (
    <>
      <div
        className="flex w-full cursor-pointer overflow-hidden rounded-lg bg-background shadow transition-shadow duration-300 hover:shadow-md"
        onClick={() => setSelectedPlace(place)}
      >
        <div className="h-32 w-1/3 flex-shrink-0 overflow-hidden">
          {/* Temporarily hiding the image
          <Image
            src={getplaceImageUrl(place.image, place.id) || "/placeholder.png"}
            alt={place.name}
            fill
            className="object-cover"
          />
          */}
        </div>

        <div className="flex w-2/3 flex-grow flex-col justify-between p-4">
          <div>
            <h3 className="mb-1 text-lg font-semibold">{place.name}</h3>
            <p className="mb-2 text-sm text-gray-600">Address not yet available</p>
          </div>
        </div>
      </div>
    </>
  );
}
