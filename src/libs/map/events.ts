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

  // Add a moveend event listener to update visible places
  map.on("moveend", () => {
    const features = map.queryRenderedFeatures(undefined, {
      layers: ["placesLayer"],
    });



    const visiblePlaces = features.map((feature) => ({
      id: feature.properties?.id,
      name: feature.properties?.name,
      category: feature.properties?.category_name,
    }));

    const { setVisiblePlaces } = useStore.getState();
    setVisiblePlaces(visiblePlaces as Place[]);
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
