import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { getImageUrl } from "@/app/lib/spots";
import { Spot } from "@/types";
import { useSpotsStore } from "../lib/spotStore";

interface SpotCardProps {
  spot: Spot;
}

export default function SpotCard({ spot }: SpotCardProps) {
  const openSpotSheet = useSpotsStore((state: any) => state.openSpotSheet);

  return (
    <div
      className="flex bg-white shadow rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300 w-full"
      onClick={() => openSpotSheet(spot)}
    >
      <div className="relative w-1/3 h-32 flex-shrink-0 overflow-hidden">
        <Image
          src={getImageUrl(spot.image, spot.id) || "/placeholder.png"}
          alt={spot.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 flex flex-col justify-between flex-grow w-2/3">
        <div>
          <h3 className="font-semibold text-lg mb-1">{spot.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{spot.address}</p>
        </div>
        <Badge variant="secondary" className="self-start">
          {spot.category.name}
        </Badge>
      </div>
    </div>
  );
}
