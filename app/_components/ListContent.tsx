import { useSpotsStore } from "@/app/lib/spotStore";
import SpotCard from "./SpotCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function ListContent() {
  const spots = useSpotsStore((state) => state.spots);
  const isLoading = useSpotsStore((state) => state.isLoading);
  console.log(isLoading);

  const [debouncedIsLoading, setDebouncedIsLoading] = useState(isLoading);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedIsLoading(isLoading);
    }, 500); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [isLoading]);

  if (debouncedIsLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    );
  }

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
