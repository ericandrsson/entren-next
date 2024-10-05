"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { MapPin } from "lucide-react";
import { Map as LeafletMap, CircleMarker, LatLng } from "leaflet";
import { useToast } from "@/src/hooks/use-toast";

interface LocationButtonProps {
  map: LeafletMap | undefined;
}

function LocationButton({ map }: LocationButtonProps) {
  const [locationMarker, setLocationMarker] = useState<CircleMarker | null>(
    null
  );
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (locationMarker) {
        locationMarker.remove();
      }
    };
  }, [locationMarker]);

  useEffect(() => {
    if (!map) return;

    const handleLocationFound = (e: L.LocationEvent) => {
      const latlng: LatLng = e.latlng;

      if (locationMarker) {
        locationMarker.setLatLng(latlng);
      } else {
        const newMarker = new CircleMarker(latlng, {
          radius: 6,
          fillColor: "#4285F4",
          color: "#FFFFFF",
          weight: 2,
          opacity: 1,
          fillOpacity: 1,
        }).addTo(map);

        // Add pulsing animation
        const pulseMarker = new CircleMarker(latlng, {
          radius: 16,
          fillColor: "#4285F4",
          fillOpacity: 0.3,
          stroke: false,
        }).addTo(map);

        const animate = () => {
          let opacity = 0.3;
          let radius = 16;
          const animation = setInterval(() => {
            opacity -= 0.01;
            radius += 0.2;
            if (opacity <= 0) {
              clearInterval(animation);
              pulseMarker.setStyle({ opacity: 0.3, radius: 16 });
              animate();
            } else {
              pulseMarker.setStyle({ fillOpacity: opacity, radius: radius });
            }
          }, 30);
        };

        animate();
        setLocationMarker(newMarker);
      }
    };

    const handleLocationError = (e: L.ErrorEvent) => {
      console.log(e);
      toast({
        title: "Unable to find your location",
        description:
          "Please make sure location services are enabled in your browser settings and try again.",
        variant: "destructive",
      });
    };

    map.on("locationfound", handleLocationFound);
    map.on("locationerror", handleLocationError);

    return () => {
      map.off("locationfound", handleLocationFound);
      map.off("locationerror", handleLocationError);
    };
  }, [map, locationMarker, toast]);

  const handleLocationClick = () => {
    if (map) {
      map.locate({ setView: true, maxZoom: 16 });
    }
  };

  return (
    <Button
      onClick={handleLocationClick}
      variant="outline"
      size="icon"
      className="bg-white text-black backdrop-blur-sm h-10 w-10 hover:bg-white/80 transition-colors duration-100"
    >
      <MapPin className="h-4 w-4" />
    </Button>
  );
}

export default LocationButton;
