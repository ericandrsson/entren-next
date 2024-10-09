"use client";

import { Input } from "@/src/components/ui/input";
import { useEffect, useState } from "react";

import { useDebounce } from "@/src/app/lib/hooks";
import { Spot } from "@/src/types/custom.types";
import FilterButton from "./FilterButton";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Spot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  async function handleSearch(term: string) {
    if (!term) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      setSearchResults([]);
    } catch (error) {
      console.error("Error searching spots:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectSpot(spot: Spot) {
    console.log(spot);
    setSearchTerm("");
    setSearchResults([]);
    //openSpotSheet(spot);
  }

  useEffect(() => {
    handleSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <div className="relative z-10">
      <div className="bg-white shadow-md p-4 flex items-center space-x-2">
        <Input
          placeholder="Sök på en plats, adress eller landmärke"
          className="flex-grow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterButton />
      </div>
      {isLoading && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md p-2 mt-1">
          Loading...
        </div>
      )}
      {!isLoading && searchResults.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white shadow-md mt-1 max-h-60 overflow-y-auto">
          {searchResults.map((spot) => (
            <li
              key={spot.spot_id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectSpot(spot)}
            >
              {spot.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
