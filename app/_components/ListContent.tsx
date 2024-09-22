import { useSpotsStore } from "@/app/lib/spotStore";
import SpotCard from "./SpotCard";

export default function ListContent() {
  const spots = useSpotsStore((state) => state.spots);

  return (
    <div className="space-y-4">
      {spots.length === 0 ? (
        <p className="text-center text-gray-500">No spots available</p>
      ) : (
        spots.map((spot) => <SpotCard key={spot.id} spot={spot} />)
      )}
    </div>
  );
}
