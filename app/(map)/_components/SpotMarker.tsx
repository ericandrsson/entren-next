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
        <div class="flex flex-col items-center transition-all duration-300 ease-in-out hover:scale-105" style="font-size: ${fontSize}px;">
          <span class="text-5xl filter drop-shadow-md" style="font-size: ${size}px;">${icon}</span>
          ${
            !isTemporary
              ? `
            <div class="flex flex-col items-center -mt-1 w-[150px]">
              <span class="font-nunito text-base font-extrabold text-blue-500 text-center max-w-[150px] overflow-hidden truncate whitespace-nowrap shadow-white">${
                spot.name
              }</span>
              ${
                formattedTime
                  ? `<span class="font-nunito text-xs font-semibold text-gray-500 text-center break-words max-w-[150px] leading-tight mt-0.5 shadow-white">${formattedTime}</span>`
                  : ""
              }
            </div>
            ${
              !spot.isVerified
                ? '<span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center border-2 border-white shadow-[0_0_0_1px_#ff9800]">!</span>'
                : ""
            }
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
        const parentCategory = categories.find(
          (c) => c.id === spot.expand.category.parent_spot_category
        );
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
        <Popup className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800 shadow-sm">
              {spot.name}
            </h2>
            <div className="flex items-center mb-3 bg-gray-100 px-3 py-2 rounded-full">
              <span className="text-xl mr-2">{categoryIcon}</span>
              <span className="text-sm font-semibold text-gray-600">
                {categoryName}
              </span>
            </div>
            {spot.image && (
              <img
                src={pb.getFileUrl(spot, spot.image)}
                alt={spot.name}
                className="w-full max-h-48 object-cover rounded-lg mb-3 shadow-md"
              />
            )}
            {spot.description && (
              <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                {spot.description}
              </p>
            )}
            {spot.created && (
              <p className="text-xs text-gray-500 italic">
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
