import { TileLayer } from "react-leaflet";

export default function MapTileLayer({
  tileLayerUrl,
}: {
  tileLayerUrl: string;
}) {
  return (
    <TileLayer
      url={tileLayerUrl}
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      noWrap={true}
    />
  );
}
