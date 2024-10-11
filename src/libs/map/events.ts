import { useStore } from "@/src/libs/store";
import { Place } from "@/src/types/custom.types";
import { createClient } from "@/utils/supabase/client";
import debounce from "lodash/debounce";

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

  // Add a click event for the entire map
  map.on("click", (e) => {
    const clickedLayer = map.queryRenderedFeatures(e.point, {
      layers: ["placesLayer"],
    });
    if (clickedLayer.length === 0) {
      const { setSelectedPlace } = useStore.getState();
      setSelectedPlace(null);
    }
  });

  // Debounced function for handling moveend event
  const debouncedMoveEnd = debounce(async () => {
    const isListVisible = useStore.getState().isListVisible;
    console.log(isListVisible);
    if (!isListVisible) return; // Exit if list is not visible

    const features = map.queryRenderedFeatures(undefined, {
      layers: ["placesLayer"],
    });

    const visiblePlaceIds = features
      .map((feature) => feature.properties?.id)
      .filter(Boolean);

    // If no places are visible, clear the visible places
    if (visiblePlaceIds.length === 0) {
      const { setVisiblePlaces } = useStore.getState();
      setVisiblePlaces([]);
      return;
    }

    console.log("visiblePlaceIds", visiblePlaceIds);

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
  }, 300); // 300ms delay, adjust as needed

  // Update the moveend event listener to use the debounced function
  map.on("moveend", debouncedMoveEnd);
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
  console.log("Unverified spot clicked", e);
}
