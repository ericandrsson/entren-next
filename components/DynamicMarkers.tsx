import React, { useEffect, useState, useCallback } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Marker, Popup } from "react-leaflet";

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Spot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  created: string;
  description?: string;
  user: string;
  isPublic: boolean;
  expand?: {
    category: Category;
  };
}

interface DynamicMarkersProps {
  spots: Spot[];
  categories: Category[];
  handleSpotDelete: (id: string) => void;
  handleSpotUpdate: (id: string, isPublic: boolean) => void;
  user: any;
  isAdmin: boolean;
  onSpotClick: (spot: Spot) => void;
}

const DynamicMarkers: React.FC<DynamicMarkersProps> = ({
  spots,
  categories,
  handleSpotDelete,
  handleSpotUpdate,
  user,
  isAdmin,
  onSpotClick,
}) => {
  console.log("DynamicMarkers received spots:", spots);
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const updateZoom = () => {
      setZoom(map.getZoom());
    };

    map.on("zoomend", updateZoom);

    return () => {
      map.off("zoomend", updateZoom);
    };
  }, [map]);

  const getSpotIcon = useCallback(
    (spot: Spot) => {
      const icon = spot.expand?.category?.icon || "📍"; // Default icon if category is undefined
      const timeAgo = new Date(spot.created).toLocaleString();

      const baseSize = 24;
      const minZoom = 10;
      const maxZoom = 18;
      const zoomFactor = Math.max(0, (zoom - minZoom) / (maxZoom - minZoom));
      const sizeMultiplier = 1 + zoomFactor * 2;
      const size = Math.round(baseSize * sizeMultiplier);
      const fontSize = Math.max(10, Math.round(14 * sizeMultiplier));

      const opacity = spot.isPublic ? 1 : 0.6;

      return L.divIcon({
        html: `
          <div class="spot-marker" style="font-size: ${fontSize}px; opacity: ${opacity};">
            <span class="spot-icon" style="font-size: ${size}px;">${icon}</span>
            <div class="spot-text">
              <span class="spot-title">${spot.name}</span>
              <span class="spot-time">${timeAgo}</span>
            </div>
            ${!spot.isPublic ? '<span class="private-indicator">🔒</span>' : ""}
          </div>
        `,
        className: "custom-div-icon",
        iconSize: L.point(size * 1.5, size * 1.5),
        iconAnchor: L.point(size * 0.75, size * 1.5),
      });
    },
    [zoom]
  );

  return (
    <MarkerClusterGroup
      chunkedLoading
      spiderfyOnMaxZoom={true}
      showCoverageOnHover={false}
      maxClusterRadius={50}
      disableClusteringAtZoom={15}
    >
      {spots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.lat, spot.lng]}
          icon={getSpotIcon(spot)}
          eventHandlers={{
            click: () => onSpotClick(spot),
          }}
        >
          <Popup>
            <h3>{spot.name}</h3>
            <p>Category: {spot.expand?.category?.name || "Uncategorized"}</p>
            <p>Created: {new Date(spot.created).toLocaleString()}</p>
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
};

export default DynamicMarkers;
