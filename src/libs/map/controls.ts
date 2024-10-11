import maplibregl from "maplibre-gl";

export function addMapControls(map: maplibregl.Map) {
  const navigationControl = new maplibregl.NavigationControl({});
  map.addControl(navigationControl, "bottom-right");

  //
  //map.addControl(
  //  new maplibregl.GeolocateControl({
  //    positionOptions: {
  //      enableHighAccuracy: true,
  //    },
  //    trackUserLocation: false,
  //  }),
  //  "bottom-right",
  //);
}
