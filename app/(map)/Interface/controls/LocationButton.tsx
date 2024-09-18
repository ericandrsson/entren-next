import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Map as LeafletMap, CircleMarker, LatLng } from "leaflet";

interface LocationButtonProps {
  map: LeafletMap | null;
}

function LocationButton({ map }: LocationButtonProps) {
  const [locationMarker, setLocationMarker] = useState<CircleMarker | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (locationMarker) {
        locationMarker.remove();
      }
    };
  }, [locationMarker]);

  const handleLocationClick = () => {
    console.log("Location button clicked");
    console.log(map);
    if (map) {
      map.locate({ setView: true, maxZoom: 16 });

      map.on("locationfound", (e) => {
        const latlng: LatLng = e.latlng;

        if (locationMarker) {
          locationMarker.setLatLng(latlng);
        } else {
          const newMarker = new CircleMarker(latlng, {
            radius: 8,
            fillColor: "#3b82f6",
            color: "#2563eb",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          }).addTo(map);
          setLocationMarker(newMarker);
        }
      });

      map.on("locationerror", (e) => {
        console.error("Location error:", e.message);
        // You might want to show an error message to the user here
      });
    }
  };

  return (
    <Button onClick={handleLocationClick} variant="outline" size="icon">
      <MapPin className="h-4 w-4" />
    </Button>
  );
}

export default LocationButton;
