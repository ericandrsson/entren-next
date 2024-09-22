"use client";

import { useEffect } from "react";
import SearchBar from "./_components/SearchBar";
import ListContent from "./_components/ListContent";
import MapView from "./(map)/Map/MapView";
import ViewToggleButton from "@/app/_components/ViewToggleButton";
import { useMapStore } from "@/app/lib/mapStore";

export default function Page() {
  const { view, isMobile, isListCollapsed, setIsMobile } = useMapStore();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 960);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    
    return () => window.removeEventListener("resize", checkIsMobile);
  }, [setIsMobile]);

  return (
    <div className="flex flex-col h-[calc(100vh-20px)]">
      <SearchBar />

      {/* Main Content Area */}
      <div className="flex-grow overflow-hidden flex relative">
        {/* List View */}
        <div
          className={`h-full overflow-y-auto transition-all duration-300 ease-in-out
            ${
              isMobile
                ? view === "map"
                  ? "hidden"
                  : "w-full"
                : isListCollapsed
                ? "w-0"
                : "w-1/3"
            } 
            ${!isMobile && "border-r"}`}
        >
          <div className="p-4">
            <ListContent />
          </div>
        </div>

        {/* Map View */}
        <div
          className={`h-full transition-all duration-300 ease-in-out
            ${
              isMobile
                ? view === "list"
                  ? "hidden"
                  : "w-full"
                : isListCollapsed
                ? "w-full"
                : "w-2/3"
            }`}
        >
          <MapView />
        </div>

        {/* Floating View Toggle Button (Mobile Only) */}
        {isMobile && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
            <ViewToggleButton />
          </div>
        )}
      </div>
    </div>
  );
}
