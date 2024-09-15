import React from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Spot {
  id?: string;
  name: string;
  lat: number;
  lng: number;
  category: string | Category;
  created?: string;
  description?: string;
  user?: string;
  isPublic?: boolean;
  expand?: {
    category: Category;
  };
}

interface SpotMarkerProps {
  spot: Spot;
  isTemporary?: boolean;
  onClick?: (spot: Spot) => void;
}

const SpotMarker: React.FC<SpotMarkerProps> = ({
  spot,
  isTemporary = false,
  onClick,
}) => {
  const getSpotIcon = () => {
    let icon = "📍"; // Default icon
    if (isTemporary) {
      icon = "📍";
    } else if (typeof spot.category === "object" && spot.category.icon) {
      icon = spot.category.icon;
    } else if (spot.expand?.category?.icon) {
      icon = spot.expand.category.icon;
    }

    const size = 40;
    const fontSize = 24;

    return L.divIcon({
      html: `
        <div class="spot-marker" style="font-size: ${fontSize}px; opacity: ${
        spot.isPublic ? 1 : 0.6
      };">
          <span class="spot-icon" style="font-size: ${size}px;">${icon}</span>
          ${
            !isTemporary
              ? `
            <div class="spot-text">
              <span class="spot-title">${spot.name}</span>
              ${
                spot.created
                  ? `<span class="spot-time">${new Date(
                      spot.created
                    ).toLocaleString()}</span>`
                  : ""
              }
            </div>
            ${!spot.isPublic ? '<span class="private-indicator">🔒</span>' : ""}
          `
              : ""
          }
        </div>
      `,
      className: "custom-div-icon",
      iconSize: L.point(size, size),
      iconAnchor: L.point(size / 2, size),
    });
  };

  return (
    <Marker
      position={[spot.lat, spot.lng]}
      icon={getSpotIcon()}
      eventHandlers={{
        click: () => onClick && onClick(spot),
      }}
    >
      {!isTemporary && (
        <Popup>
          <h3>{spot.name}</h3>
          <p>
            Category:{" "}
            {(typeof spot.category === "object"
              ? spot.category.name
              : spot.expand?.category?.name) || "Uncategorized"}
          </p>
          {spot.created && (
            <p>Created: {new Date(spot.created).toLocaleString()}</p>
          )}
        </Popup>
      )}
    </Marker>
  );
};

export default SpotMarker;
