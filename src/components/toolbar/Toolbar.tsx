"use client";

import { Input } from "@/src/components/ui/input";

import FilterButton from "@/src/components/toolbar/FilterButton";
import AddLocationButton from "./AddLocationButton";

export default function SearchBar() {
  return (
    <div className="relative z-10">
      <div className="bg-white shadow-md p-4 flex items-center space-x-2">
        <Input
          placeholder="Sök på en plats, adress eller landmärke"
          className="flex-grow"
        />
        <FilterButton />
        <AddLocationButton />
      </div>
    </div>
  );
}
