"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import "leaflet/dist/leaflet.css";
import MapInfoDrawer from "./MapInfoDrawer";
import MapControls from "./MapControls";

function MapClickHandler({ onMapClick }: { onMapClick: (e: L.LeafletMouseEvent) => void }) {
  useMapEvents({
    click: onMapClick,
  });
  return null;
}

function Map() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  const handleMapClick = useCallback((e: L.LeafletMouseEvent) => {
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
    <>
      <MapContainer
        center={[62.0, 15.0]}
        zoom={5}
        className="w-full h-screen"
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler onMapClick={handleMapClick} />
        <MapControls showListView={isSheetOpen} />
      </MapContainer>
      <MapInfoDrawer
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        markerPosition={markerPosition}
      />
    </>
  );
}

export default Map;
