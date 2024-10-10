import { useStore } from "@/src/libs/store";
import { Place } from "@/src/types/custom.types";
import { createClient } from "@/utils/supabase/client";

export async function registerMapEvents(map: maplibregl.Map) {
  map.on("click", "placesLayer", async (e) => {
    handleDetailedSpotsViewClick(e);
  });

  map.on("click", "placesOsmLayer", async (e) => {
    handleUnverifiedSpotClick(e);
  });

  map.on("mouseenter", "placesLayer", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseenter", "placesOsmLayer", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "placesLayer", () => {
    map.getCanvas().style.cursor = "";
  });

  map.on("mouseleave", "placesOsmLayer", () => {
    map.getCanvas().style.cursor = "";
  });

  // Update the moveend event listener
  map.on("moveend", async () => {
    const features = map.queryRenderedFeatures(undefined, {
      layers: ["placesLayer"],
    });

    const visiblePlaceIds = features
      .map((feature) => feature.properties?.id)
      .filter(Boolean);

    if (visiblePlaceIds.length === 0) {
      const { setVisiblePlaces } = useStore.getState();
      setVisiblePlaces([]);
      return;
    }

    const supabase = createClient();
    const { setVisiblePlaces } = useStore.getState();

    try {
      const { data: visiblePlaces, error } = await supabase
        .from("detailed_places_view")
        .select("*")
        .in("place_id", visiblePlaceIds);

      if (error) {
        console.error("Error fetching visible places:", error);
        return;
      }

      setVisiblePlaces(visiblePlaces as Place[]);
    } catch (error) {
      console.error("Error in moveend event handler:", error);
    }
  });
}

async function handleDetailedSpotsViewClick(e: maplibregl.MapLayerMouseEvent) {
  const { setSelectedPlace } = useStore.getState();
  const properties = e.features?.[0]?.properties ?? {};
  if (properties.id) {
    const supabase = createClient();
    const { data: place } = await supabase
      .from("detailed_places_view")
      .select("*")
      .eq("place_id", properties.id)
      .single();

    if (place) {
      setSelectedPlace(place);
    }
  }
}

async function handleUnverifiedSpotClick(e: maplibregl.MapLayerMouseEvent) {
  const geometry = e.features?.[0]?.geometry;
  const properties = e.features?.[0]?.properties ?? {};
}
