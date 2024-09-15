"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MapInfoDrawer from "./MapInfoDrawer";

function Map() {
  const mapRef = useRef<L.Map | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(null);

  useEffect(() => {
    if (mapRef.current !== null) return;

    const swedenCenter: [number, number] = [62.0, 15.0];
    mapRef.current = L.map("map", {
      center: swedenCenter,
      zoom: 5,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
      if (mapRef.current) {
        mapRef.current.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            mapRef.current?.removeLayer(layer);
          }
        });

        const marker = L.marker(e.latlng, {
          icon: L.divIcon({
            html: "📍",
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            className: "map-pin",
          }),
        }).addTo(mapRef.current);

        setMarkerPosition(e.latlng);
        setIsSheetOpen(true);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <div id="map" className="w-full h-screen absolute inset-0 z-0" />
      <MapInfoDrawer
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        markerPosition={markerPosition}
      />
    </>
  );
}

export default Map;
