"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

function Map() {
  const mapRef = useRef<L.Map | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(null);

  useEffect(() => {
    if (mapRef.current !== null) return;

    // Center the map on Sweden, but allow panning anywhere
    const swedenCenter: [number, number] = [62.0, 15.0];
    mapRef.current = L.map("map", {
      center: swedenCenter,
      zoom: 5,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    // Add click event to the map
    mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
      if (mapRef.current) {
        // Remove existing marker if any
        mapRef.current.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            mapRef.current?.removeLayer(layer);
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
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Add Information</SheetTitle>
            <SheetDescription>
              Enter details about this location.
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            {markerPosition && (
              <p>
                Latitude: {markerPosition.lat.toFixed(6)}, Longitude:{" "}
                {markerPosition.lng.toFixed(6)}
              </p>
            )}
            {/* Add more input fields here as needed */}
          </div>
          <SheetFooter>
            <Button onClick={() => setIsSheetOpen(false)}>Close</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default Map;
