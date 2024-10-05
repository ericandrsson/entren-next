import React, { useRef } from "react";
import L from "leaflet";
import { Marker } from "react-leaflet";
import { formatDistanceToNow, parseISO, isAfter, subDays } from "date-fns";
import { sv } from "date-fns/locale";
import { Spot } from "@/src/types/Spot";
import { useStore } from "@/src/app/lib/store";

interface SpotMarkerProps {
  spot: Spot;
}

function VerifiedSpotsMarker({ spot }: SpotMarkerProps) {
  const markerRef = useRef<L.Marker>(null);
  const setSelectedSpot = useStore((state) => state.setSelectedSpot);

  const getSpotIcon = () => {
    let icon = spot.category_icon;

    const size = 22;
    const fontSize = 24;
    const formattedTime = getFormattedTime(spot.created);

    return L.divIcon({
      html: `
        <div class="flex flex-col items-center transition-all duration-300 ease-in-out hover:scale-105" style="font-size: ${fontSize}px;">
          <span class="text-5xl filter drop-shadow-md" style="font-size: ${size}px;">${icon}</span>
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

  const handleMarkerClick = () => {
    setSelectedSpot(spot);
  };

  return (
    <Marker
      position={[spot.lat, spot.long]}
      icon={getSpotIcon()}
      eventHandlers={{
        click: handleMarkerClick,
      }}
    />
  );
}

export default VerifiedSpotsMarker;
