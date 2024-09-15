"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapInfoSheet from "./MapInfoSheet";
import MapControls from "./MapControls";
import { Sidebar } from "./Sidebar";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";

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

  const handleMapClick = useCallback((e: L.LeafletMouseEvent) => {
    // Check if the click event originated from the controls
    if (
      controlsRef.current &&
      controlsRef.current.contains(e.originalEvent.target as Node)
    ) {
      return; // Don't process the click if it's on the controls
    }

    if (mapRef.current) {
      const map = mapRef.current;

      // Remove existing marker if any
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Add new marker
      const marker = L.marker(e.latlng, {
        icon: L.divIcon({
          html: "📍",
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          className: "map-pin",
        }),
      }).addTo(map);

      setMarkerPosition(e.latlng);
      setIsSheetOpen(true);
    }
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div
        className={`flex-1 relative transition-[margin-left] ease-in-out duration-300 ${
          isSidebarOpen ? "ml-72" : "ml-[90px]"
        }`}
      >
        <MapContainer
          center={[62.0, 15.0]}
          zoom={5}
          className="w-full h-full"
          ref={mapRef}
          zoomControl={false} // Remove default zoom control
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler onMapClick={handleMapClick} />
          <div ref={controlsRef}>
            <MapControls showListView={isSheetOpen} />
          </div>
        </MapContainer>
        <MapInfoSheet
          isOpen={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          markerPosition={markerPosition}
        />
      </div>
    </div>
  );
}

export default Map;
