import { useStore } from "@/src/app/lib/store";
import { Spot } from "@/src/types/custom.types";

interface SpotCardProps {
  spot: Spot;
}

export default function SpotCard({ spot }: SpotCardProps) {
  const openSpotSheet = useStore((state) => state.openSpotSheet);

  return (
    <div
      className="flex bg-white shadow rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300 w-full"
      onClick={() => openSpotSheet(spot)}
    >
      <div className="w-1/3 h-32 flex-shrink-0 overflow-hidden">
        {/* Temporarily hiding the image
        <Image
          src={getSpotImageUrl(spot.image, spot.id) || "/placeholder.png"}
          alt={spot.name}
          fill
          className="object-cover"
        />
        */}
      </div>

      <div className="p-4 flex flex-col justify-between flex-grow w-2/3">
        <div>
          <h3 className="font-semibold text-lg mb-1">{spot.name}</h3>
          <p className="text-sm text-gray-600 mb-2">
            Address not yet available
          </p>
        </div>
      </div>
    </div>
  );
}
