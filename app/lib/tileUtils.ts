export function latLngToTile(lat: number, lon: number, zoom: number) {
  const n = 2 ** zoom;
  const xtile = Math.floor(((lon + 180) / 360) * n);
  const ytile = Math.floor(
    ((1 -
      Math.log(
        Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)
      ) /
        Math.PI) /
      2) *
      n
  );
  return { x: xtile, y: ytile, z: zoom };
}

export function tileToLatLng(x: number, y: number, z: number) {
  const n = 2 ** z;
  const lon_deg = (x / n) * 360 - 180;
  const lat_rad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)));
  const lat_deg = (lat_rad * 180) / Math.PI;
  return { lat: lat_deg, lng: lon_deg };
}
