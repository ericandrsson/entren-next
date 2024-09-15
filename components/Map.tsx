"use client";

import { useRef, useState, useCallback } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapInfoSheet from "./MapInfoSheet";
import MapControls from "./MapControls";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import ZoomButtons from "./ZoomButtons";
import SpotLayer from "./SpotLayer";
import SpotMarker from "./SpotMarker";

interface Spot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: string;
  created: string;
  description?: string;
  tags?: string[];
  user: string;
  isVerified: boolean;
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (e: L.LeafletMouseEvent) => void;
}) {
  useMapEvents({
    click: onMapClick,
  });
  return null;
}

function Map() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const { isOpen: isSidebarOpen } = useSidebarToggle();
  const [tempSpot, setTempSpot] = useState<Spot | null>(null);
  const [previewedSpot, setPreviewedSpot] = useState<Spot | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDetailed, setIsDetailed] = useState(false);

  const handleMapClick = useCallback(
    (e: L.LeafletMouseEvent) => {
      if (
        controlsRef.current &&
        controlsRef.current.contains(e.originalEvent.target as Node)
      ) {
        return;
      }

      if (previewedSpot) {
        // If a spot is being previewed, close the preview
        setPreviewedSpot(null);
        return;
      }

      if (mapRef.current) {
        const map = mapRef.current;

        const newTempSpot = {
          id: "temp",
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          name: "New Spot",
          category: "",
          created: new Date().toISOString(),
          isVerified: false,
          user: "",
        };

        setTempSpot(newTempSpot);
        setMarkerPosition(e.latlng);

        // Add a slight delay before zooming and opening the drawer
        setTimeout(() => {
          // Zoom in to the clicked location
          map.setView(e.latlng, 15);

          // Add another slight delay before opening the drawer
          setTimeout(() => {
            setIsSheetOpen(true);
          }, 400);
        }, 400);
      }
    },
    [previewedSpot]
  );

  const handleSpotClick = (spot: Spot) => {
    console.log("Spot clicked:", spot);
    setPreviewedSpot(spot);
    // You can add more functionality here if needed
  };

  const handleSheetClose = () => {
    setTempSpot(null);
    setIsSheetOpen(false);
  };

  const refreshSpots = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const tileLayerUrl = isDetailed
    ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";

  return (
    <div className="flex h-screen relative isolate">
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[62.0, 15.0]}
          zoom={5}
          className="w-full h-full"
          ref={mapRef}
          zoomControl={false}
        >
          <TileLayer
            url={tileLayerUrl}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            noWrap={true}
          />
          <MapClickHandler onMapClick={handleMapClick} />
          <div ref={controlsRef}>
            <MapControls
              showListView={isSheetOpen}
              isDetailed={isDetailed}
              onDetailToggle={() => setIsDetailed(!isDetailed)}
            />
          </div>
          <SpotLayer
            key={refreshKey}
            isAdmin={false} // Replace with actual admin status
            user={null} // Replace with actual user object
            onSpotClick={handleSpotClick}
          />
          {tempSpot && (
            <SpotMarker spot={tempSpot} isTemporary={true} categories={[]} />
          )}
        </MapContainer>
      </div>
      <div className="relative z-10 flex w-full h-full pointer-events-none">
        {/*<Sidebar /> */}
        <div className={`flex-1 ${isSidebarOpen ? "ml-72" : "ml-[90px]"}`}>
          <div className="pointer-events-auto">
            {/* Remove MapControls from here if it's not needed outside the map */}
          </div>
        </div>
      </div>
      <MapInfoSheet
        isOpen={isSheetOpen}
        onOpenChange={handleSheetClose}
        markerPosition={markerPosition}
        onSpotCreated={() => {
          handleSheetClose();
          refreshSpots();
        }}
      />
    </div>
  );
}

export default Map;
