import maplibregl from "maplibre-gl";

export function addPlacesSource(map: maplibregl.Map) {
  map.addSource("placesSource", {
    type: "vector",
    url: `${process.env.NEXT_PUBLIC_TILE_SERVER_URL}/map_places_view`,
  });
}

export function addPlacesOsmSource(map: maplibregl.Map) {
  map.addSource("placesOsmSource", {
    type: "vector",
    url: `${process.env.NEXT_PUBLIC_TILE_SERVER_URL}/map_places_osm_view`,
  });
}
