import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

interface Spot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: {
    icon: string;
    name: string;
  };
  created: string;
}

interface SpotMarkerProps {
  spot: Spot;
  onClick: (spot: Spot) => void;
}

const SpotMarker: React.FC<SpotMarkerProps> = ({ spot, onClick }) => {
  const icon = L.divIcon({
    className: "spot-marker",
    html: `
      <div class="spot-icon">${spot.category.icon}</div>
      <div class="spot-text">
        <div class="spot-title">${spot.name}</div>
        <div class="spot-time">${new Date(spot.created).toLocaleString()}</div>
      </div>
    `,
    iconSize: [150, 100],
    iconAnchor: [75, 100],
  });

  return (
    <Marker
      position={[spot.lat, spot.lng]}
      icon={icon}
      eventHandlers={{
        click: () => onClick(spot),
      }}
    >
      <Popup>
        <h3>{spot.name}</h3>
        <p>Category: {spot.category.name}</p>
        <p>Created: {new Date(spot.created).toLocaleString()}</p>
      </Popup>
    </Marker>
  );
};

export default SpotMarker;
