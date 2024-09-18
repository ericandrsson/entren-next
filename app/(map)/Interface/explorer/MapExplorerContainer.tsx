import React, { useState } from "react";
import SearchBar from "./SearchBar";
import FilterBox from "./FilterBox";
import SpotDetailsBox from "./SpotDetailsPanel";
import { Spot, SearchResult } from "@/types";

interface MapExplorerContainerProps {
  onSelectSpot: (result: SearchResult) => void;
  selectedSpot: Spot | null;
  onCloseSpotDetails: () => void;
  onFilterChange: (filters: any) => void;
}

function MapExplorerContainer({
  onSelectSpot,
  selectedSpot,
  onCloseSpotDetails,
  onFilterChange,
}: MapExplorerContainerProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const handleSearchFocus = () => {
    setIsSearching(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => setIsSearching(false), 200);
  };

  const handleSelectSpot = (result: SearchResult) => {
    setIsSearching(false);
    onSelectSpot(result);
  };

  const handleCloseSpotDetails = () => {
    onCloseSpotDetails();
    setIsFilterOpen(true);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="w-[400px] max-w-[calc(100vw-2rem)] overflow-hidden pointer-events-auto">
      <div className="w-full bg-white rounded-lg shadow-lg p-4">
        <SearchBar
          onSelectSpot={handleSelectSpot}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          isFilterOpen={isFilterOpen}
          toggleFilter={toggleFilter}
        />
        {selectedSpot && !isSearching && (
          <div className="mt-2 border-t">
            <SpotDetailsBox
              spot={selectedSpot}
              onClose={handleCloseSpotDetails}
            />
          </div>
        )}
        {!selectedSpot && !isSearching && isFilterOpen && (
          <div className="mt-2 border-t">
            <FilterBox onFilterChange={onFilterChange} />
          </div>
        )}
      </div>
    </div>
  );
}

export default MapExplorerContainer;
