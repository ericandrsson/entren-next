import React from "react";
import { Map as LeafletMap } from "leaflet";
import ZoomButtons from "./controls/ZoomButtons";
import LocationButton from "./controls/LocationButton";

interface MapControlsProps {
  map: LeafletMap | null;
}

function MapControls({ map }: MapControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 z-[1000] hidden sm:flex flex-col gap-2 pointer-events-auto">
      {map && <LocationButton map={map} />}
      {map && <ZoomButtons map={map} />}
    </div>
  );
}

export default MapControls;
