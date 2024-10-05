import { MapContainer, TileLayer } from 'react-leaflet';
import SpotsLayer from './SpotLayers/SpotsLayer';

function MapComponent() {
  return (
    <MapContainer center={[0, 0]} zoom={2} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <SpotsLayer />
    </MapContainer>
  );
}

export default MapComponent;