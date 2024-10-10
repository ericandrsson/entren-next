import { Skeleton } from "@/src/components/ui/skeleton";
import { useStore } from "@/src/libs/store";
import { useEffect, useState } from "react";
import SpotCard from "./ListViewCard";

export default function ListContent() {
  const visiblePlaces = useStore((state) => state.visiblePlaces);
  const isLoading = useStore((state) => state.isLoading);
  const view = useStore((state) => state.view);
  const [debouncedIsLoading, setDebouncedIsLoading] = useState(isLoading);

  console.log(visiblePlaces.length);

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
      {visiblePlaces.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          {view === "list"
            ? "Inga platser hittades. Försök med en annan sökterm eller ändra dina filterinställningar."
            : "Inga platser hittades i det aktuella kartområdet. Zooma ut eller flytta kartan för att se fler platser."}
        </p>
      ) : (
        visiblePlaces.map((place) => (
          <SpotCard key={place.place_id} spot={place} />
        ))
      )}
    </div>
  );
}

export function ListView() {
  const visiblePlaces = useStore((state) => state.visiblePlaces);

  return (
    <div>
      <h2>Visible Places</h2>
      <ul>
        {visiblePlaces.map((place) => (
          <li key={place.id}>
            {place.name} - {place.category}
          </li>
        ))}
      </ul>
    </div>
  );
}
