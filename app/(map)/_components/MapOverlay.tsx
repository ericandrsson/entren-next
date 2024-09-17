import React from "react";
import ZoomButtons from "./controls/ZoomButtons";
import MapDetailToggle from "./controls/MapDetailToggle";
import MapExplorerPanel from "./explorer/MapExplorerPanel";
import { Spot, SearchResult } from "@/types"; // Make sure to create these types

interface MapControlsProps {
  showListView: boolean;
  isDetailed: boolean;
  onDetailToggle: () => void;
  onSelectPlace: (result: SearchResult) => void;
  selectedSpot: Spot | null;
  onCloseSpotDetails: () => void;
  onFilterChange: (filters: any) => void;
}

function MapOverlay({
  showListView,
  isDetailed,
  onDetailToggle,
  onSelectPlace,
  selectedSpot,
  onCloseSpotDetails,
  onFilterChange,
}: MapControlsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <MapExplorerPanel
        onSelectPlace={onSelectPlace}
        selectedSpot={selectedSpot}
        onCloseSpotDetails={onCloseSpotDetails}
        onFilterChange={onFilterChange}
      />
      <div className="absolute top-4 right-4 z-[1000] pointer-events-auto">
        <MapDetailToggle isDetailed={isDetailed} onToggle={onDetailToggle} />
      </div>
      <div className="absolute bottom-4 right-4 z-[1000] hidden sm:block pointer-events-auto">
        <ZoomButtons showListView={showListView} />
      </div>
    </div>
  );
}

export default MapOverlay;
