import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { getImageUrl } from "@/app/lib/spots";
import { Spot } from "@/types";
import { useSpotsStore } from "../lib/spotStore";

interface SpotCardProps {
  spot: Spot;
}

export default function SpotCard({ spot }: SpotCardProps) {
  const openSpotSheet = useSpotsStore((state) => state.openSpotSheet);

  return (
    <div
      className="flex bg-white shadow rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow duration-300"
      onClick={() => openSpotSheet(spot)}
    >
      <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden">
        <Image
          src={getImageUrl(spot.image, spot.id) || "/placeholder.png"}
          alt={spot.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-lg">{spot.name}</h3>
          <p className="text-sm text-gray-600">{spot.address}</p>
        </div>
        <Badge variant="secondary" className="self-start mt-2">
          {spot.category.name}
        </Badge>
      </div>
    </div>
  );
}
