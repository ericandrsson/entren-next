import { useStore } from "@/src/libs/store";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import ListViewCard from "./ListViewCard";

export default function ListView() {
  const supabase = createClient();
  const {
    visiblePlaces,
    isMobile,
    view,
    isListVisible,
    userLocation,
    setVisiblePlaces,
  } = useStore();

  useEffect(() => {
    async function fetchNearestPlaces() {
      if (visiblePlaces.length === 0 && userLocation && isListVisible) {
        const { data, error } = await supabase.rpc("get_nearest_places", {
          user_lat: userLocation.latitude,
          user_long: userLocation.longitude,
          limit_count: 10,
          max_distance_meters: 100,
        });

        if (error) {
          console.error("Error fetching nearest places:", error);
        } else if (data) {
          setVisiblePlaces(data);
        }
      }
    }

    fetchNearestPlaces();
  }, [userLocation, supabase, setVisiblePlaces]);

  return (
    <div className="space-y-4">
      {visiblePlaces.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          {view === "list" && isMobile
            ? "Inga platser hittades. Försök med en annan sökterm eller ändra dina filterinställningar."
            : "Inga platser hittades i det aktuella kartområdet. Zooma ut eller flytta kartan för att se fler platser."}
        </p>
      ) : (
        visiblePlaces.map((place) => (
          <ListViewCard key={place.place_id} place={place} />
        ))
      )}
    </div>
  );
}
