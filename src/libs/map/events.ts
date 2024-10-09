import { useStore } from "@/src/libs/store";
import { createClient } from "@/utils/supabase/client";

export async function registerMapEvents(map: maplibregl.Map) {
  map.on("click", "detailed_spots_view", async (e) => {
    handleDetailedSpotsViewClick(e);
  });

  map.on("click", "local_sweden_osm_poi", async (e) => {
    handleUnverifiedSpotClick(e);
  });

  // Added event listeners for cursor management
  map.on("mouseenter", "detailed_spots_view", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseenter", "local_sweden_osm_poi", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "detailed_spots_view", () => {
    map.getCanvas().style.cursor = "";
  });

  map.on("mouseleave", "local_sweden_osm_poi", () => {
    map.getCanvas().style.cursor = "";
  });
}

async function handleDetailedSpotsViewClick(e: maplibregl.MapLayerMouseEvent) {
  const { setSelectedSpot } = useStore.getState();
  const geometry = e.features?.[0]?.geometry;
  if (geometry && "coordinates" in geometry) {
    const properties = e.features?.[0]?.properties ?? {};
    const supabase = createClient();
    const { data: spot } = await supabase
      .from("detailed_spots_view")
      .select("*")
      .eq("spot_id", properties.spot_id)
      .single();
    console.log(spot);
    if (spot) {
      setSelectedSpot(spot);
    }
  }
}

async function handleUnverifiedSpotClick(e: maplibregl.MapLayerMouseEvent) {
  const geometry = e.features?.[0]?.geometry;
  const properties = e.features?.[0]?.properties ?? {};
  console.log(properties);
}
