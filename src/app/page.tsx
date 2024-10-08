"use client";

import { useEffect } from "react";
import SearchBar from "./_components/SearchBar";
import ListContent from "./_components/ListContent";
import MapView from "./(map)/Map/MapView";
import ViewToggleButton from "@/src/app/_components/ViewToggleButton";
import { useStore } from "@/src/app/lib/store";
import { useToast } from "@/src/hooks/use-toast";

export default function Page() {
  const { view, isMobile, isListCollapsed, setIsMobile } = useStore();
  const { toast } = useToast();

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 960);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, [setIsMobile]);

  useEffect(() => {
    const storedToast = localStorage.getItem('accountCreatedToast');
    if (storedToast) {
      const toastData = JSON.parse(storedToast);
      toast(toastData);
      localStorage.removeItem('accountCreatedToast');
    }
  }, [toast]);

  return (
    <div className="flex flex-col h-screen">
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
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
            <ViewToggleButton />
          </div>
        )}
      </div>
    </div>
  );
}
