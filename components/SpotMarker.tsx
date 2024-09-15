import React from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { formatDistanceToNow, parseISO, isAfter, subDays } from "date-fns";
import { sv } from "date-fns/locale";
import { pb } from "@/lib/db";

interface Category {
  id: string;
  name: string;
  icon: string;
  parent_spot_category?: string | null;
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
  image?: string;
  expand?: {
    category: Category;
  };
}

interface SpotMarkerProps {
  spot: Spot;
  categories: Category[];
  isTemporary?: boolean;
  onClick?: (spot: Spot) => void;
}

const SpotMarker: React.FC<SpotMarkerProps> = ({
  spot,
  categories,
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

  const getCategoryInfo = () => {
    let icon = "📍";
    let name = "Uncategorized";

    if (typeof spot.category === "object" && spot.category.icon) {
      icon = spot.category.icon;
      name = spot.category.name;
    } else if (spot.expand?.category) {
      icon = spot.expand.category.icon;
      name = spot.expand.category.name;

      // Check for subcategory
      if (spot.expand.category.parent_spot_category) {
        const parentCategory = categories.find(c => c.id === spot.expand.category.parent_spot_category);
        if (parentCategory) {
          name = `${parentCategory.name} - ${name}`;
        }
      }
    }

    return { icon, name };
  };

  const { icon: categoryIcon, name: categoryName } = getCategoryInfo();

  return (
    <Marker
      position={[spot.lat, spot.lng]}
      icon={getSpotIcon()}
      eventHandlers={{
        click: () => onClick && onClick(spot),
      }}
    >
      {!isTemporary && (
        <Popup className="custom-popup">
          <div className="popup-content">
            <h2 className="popup-title">{spot.name}</h2>
            <div className="popup-category">
              <span className="category-icon">{categoryIcon}</span>
              <span className="category-name">{categoryName}</span>
            </div>
            {spot.image && (
              <img
                src={pb.getFileUrl(spot, spot.image)}
                alt={spot.name}
                className="popup-image"
              />
            )}
            {spot.description && (
              <p className="popup-description">{spot.description}</p>
            )}
            {spot.created && (
              <p className="popup-created">
                Skapad: {new Date(spot.created).toLocaleString("sv-SE")}
              </p>
            )}
          </div>
        </Popup>
      )}
    </Marker>
  );
};

export default SpotMarker;
