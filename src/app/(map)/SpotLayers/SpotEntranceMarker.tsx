import React from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { SpotEntrance } from "@/src/types/custom.types";

interface SpotEntranceMarkerProps {
  entrance: SpotEntrance;
}

function SpotEntranceMarker({ entrance }: SpotEntranceMarkerProps) {
  const getEntranceIcon = () => {
    return L.divIcon({
      html: `<span class="text-2xl">🚪</span>`, // You can customize this
      className: "entrance-icon",
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  };

  return (
    <Marker
      position={[entrance.lat, entrance.long]}
      icon={getEntranceIcon()}
    >
      <Popup>
        <div>
          <h3>{entrance.name || "Entrance"}</h3>
          <p>{entrance.description || "No description available"}</p>
        </div>
      </Popup>
    </Marker>
  );
}

export default SpotEntranceMarker;