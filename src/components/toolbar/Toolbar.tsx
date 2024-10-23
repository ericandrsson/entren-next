"use client";

import { Input } from "@/src/components/ui/input";

import FilterButton from "@/src/components/toolbar/FilterButton";

export default function SearchBar() {
  return (
    <div className="relative z-10">
      <div className="flex items-center space-x-2 bg-white p-4 shadow-md">
        <Input placeholder="Sök på en plats, adress eller landmärke" className="flex-grow" />
        <FilterButton />
      </div>
    </div>
  );
}
