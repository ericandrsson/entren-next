import maplibregl from "maplibre-gl";

export function addDetailedSpotsLayer(map: maplibregl.Map) {
  map.addLayer({
    id: "detailed_spots_view",
    type: "symbol",
    source: "detailedSpots",
    "source-layer": "detailed_spots_view",
    layout: {
      "icon-image": "{category_name}",
      "icon-size": 0.65,
      "icon-anchor": "bottom",
      "text-field": "{name}",
      "text-font": ["Noto Sans Bold"],
      "text-size": 14,
      "text-offset": [0, 0.1],
      "text-anchor": "top",
      "icon-allow-overlap": true,
      "text-allow-overlap": true,
      "text-padding": 2,
    },
    paint: {
      "icon-opacity": 1,
      "text-halo-width": 1,
      "text-halo-color": "rgba(255, 255, 255, 0.75)",
      "text-color": "#348f50",
    },
  });
}

export function addLocalSwedenOsmPoiLayer(map: maplibregl.Map) {
  map.addLayer({
    id: "local_sweden_osm_poi_circle",
    type: "circle",
    source: "local_sweden_osm_poi",
    "source-layer": "local_sweden_osm_poi",
    paint: {
      "circle-color": "red",
      "circle-radius": 10,
      "circle-opacity": 0.3,
    },
    minzoom: 10,
  });

  map.addLayer({
    id: "local_sweden_osm_poi",
    type: "symbol",
    source: "local_sweden_osm_poi",
    "source-layer": "local_sweden_osm_poi",
    layout: {
      "text-field": "{name}",
      "text-font": ["Noto Sans Regular"],
      "text-size": 12,
      "text-offset": [0, 0.1],
      "text-anchor": "top",
    },
    paint: {
      "text-color": "rgba(255, 0, 0, 0.5)",
      "text-halo-width": 1,
      "text-halo-color": "rgba(255, 255, 255, 0.5)",
    },
    minzoom: 10,
  });
}
