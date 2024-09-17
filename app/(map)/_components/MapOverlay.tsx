import React, { useState } from "react";
import ZoomButtons from "./controls/ZoomButtons";
import MapDetailToggle from "./controls/MapDetailToggle";
import MapExplorerContainer from "./explorer/MapExplorerContainer";
import ModeSwitcher from "./controls/ModeSwitcher";
import { Spot, SearchResult } from "@/types";
import { Map as LeafletMap } from "leaflet";

interface MapOverlayProps {
  showListView: boolean;
  isDetailed: boolean;
  onDetailToggle: () => void;
  onSelectPlace: (result: SearchResult) => void;
  selectedSpot: Spot | null;
  onCloseSpotDetails: () => void;
  onFilterChange: (filters: any) => void;
  map: LeafletMap | null;
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
}: MapOverlayProps) {
  const [currentMode, setCurrentMode] = useState<'view' | 'contribute'>('view');

  const handleModeChange = (mode: 'view' | 'contribute') => {
    setCurrentMode(mode);
    // Add any additional logic for mode change here
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-4 left-4 z-[1000]">
        <MapExplorerContainer
          onSelectPlace={onSelectPlace}
          selectedSpot={selectedSpot}
          onCloseSpotDetails={onCloseSpotDetails}
          onFilterChange={onFilterChange}
        />
      </div>
      <div className="absolute top-4 right-4 z-[1000] pointer-events-auto flex items-center space-x-4">
        <ModeSwitcher currentMode={currentMode} onModeChange={handleModeChange} />
        <MapDetailToggle isDetailed={isDetailed} onToggle={onDetailToggle} />
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
