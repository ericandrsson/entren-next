import { useStore } from "@/src/app/lib/store";
import SpotCard from "./SpotCard";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useEffect, useState } from "react";

export default function ListContent() {
  const spots = useStore((state) => state.spots);
  const isLoading = useStore((state) => state.isLoading);
  const view = useStore((state) => state.view);
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
        <p className="text-center text-gray-500 mt-8">
          {view === "list"
            ? "Inga platser hittades. Försök med en annan sökterm eller ändra dina filterinställningar."
            : "Inga platser hittades i det aktuella kartområdet. Zooma ut eller flytta kartan för att se fler platser."}
        </p>
      ) : (
        spots.map((spot) => <SpotCard key={spot.id} spot={spot} />)
      )}
    </div>
  );
}
