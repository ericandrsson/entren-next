"use client";


import { Button } from "@/src/components/ui/button";
import { MapPin } from "lucide-react";


interface LocationButtonProps {
  map: maplibregl.Map | undefined;
}

function LocationButton({ map }: LocationButtonProps) {
  return (
    <Button
      onClick={() => {}}
      variant="outline"
      size="icon"
      className="bg-white text-black backdrop-blur-sm h-10 w-10 hover:bg-white/80 transition-colors duration-100"
    >
      <MapPin className="h-4 w-4" />
    </Button>
  );
}

export default LocationButton;
