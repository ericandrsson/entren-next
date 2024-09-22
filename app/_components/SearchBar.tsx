"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import FilterButton from "./FilterButton";
import { Spot } from "@/types";
import { useDebounce } from "@/app/lib/hooks";
import { useSpotsStore } from "../lib/spotStore";
import { pb } from "@/lib/db";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Spot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setSelectedSpot, setMapView } = useSpotsStore();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  async function handleSearch(term: string) {
    if (!term) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const resultList = await pb.collection("spots").getList(1, 10, {
        filter: `name ~ "${term}" || description ~ "${term}"`,
        sort: "-created",
      });
      setSearchResults(resultList.items.map(item => ({
        id: item.id,
        name: item.name,
        lat: item.lat,
        lng: item.lng,
        category: item.category,
        created: item.created,
        description: item.description,
        user: item.user,
        isVerified: item.isVerified,
        image: item.image,
      } as Spot)));
    } catch (error) {
      console.error("Error searching spots:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectSpot(spot: Spot) {
    setSelectedSpot(spot);
    setMapView({ center: [spot.lat, spot.lng], zoom: 16 });
    setSearchTerm("");
    setSearchResults([]);
  }

  useEffect(() => {
    handleSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <div className="relative z-10">
      <div className="bg-white shadow-md p-4 flex items-center space-x-2">
        <Input
          placeholder="Search..."
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
              key={spot.id}
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
