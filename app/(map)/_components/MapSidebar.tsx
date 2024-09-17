import React, { useState } from "react";
import SearchBar from "./controls/SearchBar";
import SpotDetailsBox from "./SpotDetailsBox";
import FilterBox from "./FilterBox";
import { Spot, SearchResult } from "@/types"; // Make sure to create these types

interface MapSidebarProps {
  onSelectPlace: (result: SearchResult) => void;
  selectedSpot: Spot | null;
  onCloseSpotDetails: () => void;
  onFilterChange: (filters: any) => void;
}

function MapSidebar({
  onSelectPlace,
  selectedSpot,
  onCloseSpotDetails,
  onFilterChange,
}: MapSidebarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg overflow-hidden pointer-events-auto">
      <div className="p-4">
        <SearchBar onSelectPlace={onSelectPlace} />
      </div>
      {selectedSpot ? (
        <SpotDetailsBox spot={selectedSpot} onClose={onCloseSpotDetails} />
      ) : (
        <div className="p-4 border-t">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
          >
            {isFilterOpen ? "Hide Filters" : "Show Filters"}
          </button>
          {isFilterOpen && <FilterBox onFilterChange={onFilterChange} />}
        </div>
      )}
    </div>
  );
}

export default MapSidebar;