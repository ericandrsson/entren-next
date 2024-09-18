import React from "react";
import ZoomButtons from "./controls/ZoomButtons";
import MapDetailToggle from "./controls/MapDetailToggle";
import MapExplorerContainer from "../explorer/MapExplorerContainer";
import ModeSwitcher from "./controls/ModeSwitcher";
import { Spot, SearchResult } from "@/types";
import { Map as LeafletMap } from "leaflet";
import LocationButton from "./controls/LocationButton";

interface MapControlProps {
  showListView: boolean;
  isDetailed: boolean;
  onDetailToggle: () => void;
  onSelectPlace: (result: SearchResult) => void;
  selectedSpot: Spot | null;
  onCloseSpotDetails: () => void;
  onFilterChange: (filters: any) => void;
  map: LeafletMap | null;
  onModeChange: (mode: "view" | "contribute") => void;
  currentMode: "view" | "contribute";
}

function MapOverlay({
  showListView,
  isDetailed,
  onDetailToggle,
  onSelectPlace,
  selectedSpot,
  onCloseSpotDetails,
  onFilterChange,
  map,
  onModeChange,
  currentMode,
}: MapControlProps) {
  const handleModeChange = (mode: "view" | "contribute") => {
    onModeChange(mode);
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-start w-full p-4 z-[1000]">
        <div className="pointer-events-auto order-2 sm:order-1 mt-4 sm:mt-0">
          <MapExplorerContainer
            onSelectPlace={onSelectPlace}
            selectedSpot={selectedSpot}
            onCloseSpotDetails={onCloseSpotDetails}
            onFilterChange={onFilterChange}
          />
        </div>
        <div className="pointer-events-auto order-1 sm:order-2 sm:mb-0">
          <ModeSwitcher
            currentMode={currentMode}
            onModeChange={handleModeChange}
          />
        </div>
        <div className="pointer-events-auto order-3 mt-4 sm:mt-0">
          <MapDetailToggle isDetailed={isDetailed} onToggle={onDetailToggle} />
          <LocationButton map={map} />
        </div>
      </div>
      {map && (
        <div className="absolute bottom-4 right-4 z-[1000] hidden sm:block pointer-events-auto">
          <ZoomButtons showListView={showListView} map={map} />
        </div>
      )}
    </div>
  );
}

export default MapOverlay;
