import React, { useState } from "react";
import SearchBar from "./SearchBar";
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
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const handleSearchFocus = () => {
    setIsSearching(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => setIsSearching(false), 200); // Delay to allow click events on search results
  };

  const handleSelectPlace = (result: SearchResult) => {
    setIsSearching(false);
    onSelectPlace(result);
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
      <div className="p-4">
        <SearchBar
          onSelectPlace={handleSelectPlace}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          selectedSpot={selectedSpot}
          onCloseSpotDetails={handleCloseSpotDetails}
          isFilterOpen={isFilterOpen}
          toggleFilter={toggleFilter}
          onFilterChange={onFilterChange}
        />
      </div>
    </div>
  );
}

export default MapExplorerContainer;
