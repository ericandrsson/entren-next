import React from "react";
import ZoomButtons from "./ZoomButtons";
import MapDetailToggle from "./MapDetailToggle";
import MapExplorerPanel from "../MapExplorerPanel";
import { Spot, SearchResult } from "@/types";

// ... rest of the code remains the same

function MapControls({
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
      {/* ... rest of the code remains the same */}
    </div>
  );
}

export default MapControls;