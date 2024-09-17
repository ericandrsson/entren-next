import React, { useState } from "react";
import SearchBar from "./SearchBar";
import SpotDetailsBox from "./SpotDetailsPanel";
import FilterBox from "./FilterBox";
import { Spot, SearchResult } from "@/types";

interface MapExplorerContainerProps {
  onSelectPlace: (result: SearchResult) => void;
  selectedSpot: Spot | null;
  onCloseSpotDetails: () => void;
  onFilterChange: (filters: any) => void;
}

function MapExplorerContainer({
  onSelectPlace,
  selectedSpot,
  onCloseSpotDetails,
  onFilterChange,
}: MapExplorerContainerProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchFocus = () => {
    setIsSearching(true);
    setIsFilterOpen(false);
  };

  const handleSearchBlur = () => {
    setIsSearching(false);
  };

  const handleSelectPlace = (result: SearchResult) => {
    setIsSearching(false);
    onSelectPlace(result);
  };

  return (
    <div className="w-[400px] max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg overflow-hidden pointer-events-auto">
      <div className="p-4">
        <SearchBar 
          onSelectPlace={handleSelectPlace} 
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
        />
      </div>
      {!isSearching && (
        <div className="p-4 border-t">
          {selectedSpot ? (
            <SpotDetailsBox spot={selectedSpot} onClose={onCloseSpotDetails} />
          ) : (
            <>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
              >
                {isFilterOpen ? "Hide Filters" : "Show Filters"}
              </button>
              {isFilterOpen && <FilterBox onFilterChange={onFilterChange} />}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default MapExplorerContainer;