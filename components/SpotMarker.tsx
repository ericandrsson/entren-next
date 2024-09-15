import React from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { formatDistanceToNow, parseISO, isAfter, subDays } from "date-fns";
import { sv } from "date-fns/locale";

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
  isVerified?: boolean;
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

    const formattedTime = getFormattedTime(spot.created);

    return L.divIcon({
      html: `
        <div class="spot-marker" style="font-size: ${fontSize}px;">
          <span class="spot-icon" style="font-size: ${size}px;">${icon}</span>
          ${
            !isTemporary
              ? `
            <div class="spot-text">
              <span class="spot-title">${spot.name}</span>
              ${formattedTime ? `<span class="spot-time">${formattedTime}</span>` : ""}
            </div>
            ${!spot.isVerified ? '<span class="unverified-indicator">!</span>' : ""}
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

  const getFormattedTime = (createdTime?: string) => {
    if (!createdTime) return null;

    const createdDate = parseISO(createdTime);
    const threeDaysAgo = subDays(new Date(), 3);

    if (isAfter(createdDate, threeDaysAgo)) {
      return formatDistanceToNow(createdDate, { addSuffix: true, locale: sv });
    }

    return null;
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
            Kategori:{" "}
            {(typeof spot.category === "object"
              ? spot.category.name
              : spot.expand?.category?.name) || "Okategoriserad"}
          </p>
          {spot.created && (
            <p>Skapad: {new Date(spot.created).toLocaleString("sv-SE")}</p>
          )}
          <p>Status: {spot.isVerified ? "Verifierad" : "Ej verifierad"}</p>
        </Popup>
      )}
    </Marker>
  );
};

export default SpotMarker;
