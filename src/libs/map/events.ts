import { useStore } from "@/src/libs/store";
import { Place, PlaceOsm } from "@/src/types/custom.types";
import { createClient } from "@/utils/supabase/client";
import debounce from "lodash/debounce";

export async function registerMapEvents(map: maplibregl.Map) {
  map.on("click", "placesLayer", async (e) => {
    handlePlacesLayerClick(e);
  });

  map.on("click", "placesOsmLayer", async (e) => {
    handlePlacesOsmLayerClick(e);
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
    const { view, setVisiblePlaces } = useStore.getState();

    const shouldShowList = view === "both"; // We only want to setVisiblePlaces when the list and map are both visible
    if (!shouldShowList) return;

    const features = map.queryRenderedFeatures(undefined, {
      layers: ["placesLayer"],
    });

    const visiblePlaceIds = features
      .map((feature) => feature.properties?.id)
      .filter(Boolean);

    // If no places are visible, clear the visible places
    if (visiblePlaceIds.length === 0) {
      setVisiblePlaces([]);
      return;
    }

    const supabase = createClient();

    const { data: visiblePlaces, error } = await supabase
      .from("detailed_places_view")
      .select("*")
      .in("place_id", visiblePlaceIds)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching visible places:", error);
      return;
    }

    setVisiblePlaces(visiblePlaces as Place[]);
  }, 300);

  // Update the moveend event listener to use the debounced function
  map.on("moveend", debouncedMoveEnd);
}

async function handlePlacesLayerClick(e: maplibregl.MapLayerMouseEvent) {
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

async function handlePlacesOsmLayerClick(e: maplibregl.MapLayerMouseEvent) {
  const { setSelectedPlace } = useStore.getState();
  const properties = e.features?.[0]?.properties ?? {};
  if (properties.osm_id) {
    const supabase = createClient();
    const { data: place } = await supabase
      .from("detailed_places_osm_view")
      .select("*")
      .eq("osm_id", properties.osm_id)
      .single();

    if (place) {
      setSelectedPlace(place as PlaceOsm);
    }
  }
}
