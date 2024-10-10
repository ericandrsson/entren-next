import { useStore } from "@/src/libs/store";
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
}

async function handleDetailedSpotsViewClick(e: maplibregl.MapLayerMouseEvent) {
  const { setSelectedPlace } = useStore.getState();
  const geometry = e.features?.[0]?.geometry;
  if (geometry && "coordinates" in geometry) {
    const properties = e.features?.[0]?.properties ?? {};
    const supabase = createClient();
    const { data: place } = await supabase
      .from("detailed_places_view")
      .select("*")
      .eq("place_id", properties.id)
      .single();
    console.log(place);
    if (place) {
      setSelectedPlace(place);
    }
  }
}

async function handleUnverifiedSpotClick(e: maplibregl.MapLayerMouseEvent) {
  const geometry = e.features?.[0]?.geometry;
  const properties = e.features?.[0]?.properties ?? {};
  console.log(properties);
}
