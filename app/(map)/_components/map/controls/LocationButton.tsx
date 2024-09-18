import React from "react";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { Map as LeafletMap } from "leaflet";

interface LocationButtonProps {
  map: LeafletMap | null;
}

function LocationButton({ map }: LocationButtonProps) {
  const handleLocationClick = () => {
    if (map) {
      map.locate({ setView: true, maxZoom: 16 });
    }
  };

  return (
    <Button onClick={handleLocationClick} variant="outline" size="icon">
      <MapPin className="h-4 w-4" />
    </Button>
  );
}

export default LocationButton;
