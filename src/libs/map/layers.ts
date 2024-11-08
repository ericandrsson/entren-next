import maplibregl from "maplibre-gl";

export function addPlacesLayer(map: maplibregl.Map) {
  map.addLayer({
    id: "placesLayer",
    type: "symbol",
    source: "placesSource",
    "source-layer": "places_view",
    layout: {
      "icon-image": ["get", "/sprite/food.png"],
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
      "text-color": ["case", ["==", ["get", "has_entrances"], false], "red", "#348f50"],
      "icon-color": [
        "case",
        ["==", ["get", "has_entrances"], false],
        "red",
        "rgba(0, 0, 0, 0)", // Transparent for places with entrances
      ],
    },
  });
}

export function addPlacesOsmLayer(map: maplibregl.Map) {
  map.addLayer({
    id: "placesOsmLayer",
    type: "circle",
    source: "placesOsmSource",
    "source-layer": "map_places_osm_view",
    paint: {
      "circle-color": "red",
      "circle-radius": 10,
      "circle-opacity": 0.3,
    },
    minzoom: 10,
  });
}
