import maplibregl from "maplibre-gl";

export function addDetailedSpotsSource(map: maplibregl.Map) {
  map.addSource("detailedSpots", {
    type: "vector",
    url: "http://p4o0gckwc0wokcgoscws0c0s.135.181.108.171.sslip.io//detailed_spots_view",
  });
}

export function addLocalSwedenOsmPoiSource(map: maplibregl.Map) {
  map.addSource("local_sweden_osm_poi", {
    type: "vector",
    url: "http://p4o0gckwc0wokcgoscws0c0s.135.181.108.171.sslip.io/local_sweden_osm_poi",
  });
}