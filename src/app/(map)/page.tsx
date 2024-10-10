"use client";

import ListView from "@/src/components/ListView";
import MapView from "@/src/components/map/MapView";
import PlaceDetailDrawer from "@/src/components/place/PlaceDetailDrawer";
import ActionToolBar from "@/src/components/toolbar/Toolbar";
import ViewToggleButton from "@/src/components/ViewToggleButton";
import { useToast } from "@/src/hooks/use-toast";
import { useStore } from "@/src/libs/store";
import { useEffect, useState } from "react";

export default function Page() {
  const { view, isMobile, isListCollapsed, setIsMobile, selectedPlace } =
    useStore();
  const setIsStickyHeader = useStore((state) => state.setIsStickyHeader);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  useEffect(() => {
    setIsStickyHeader(true);
    return () => setIsStickyHeader(false);
  }, [setIsStickyHeader]);

  const { toast } = useToast();

  useEffect(() => {
    if (selectedPlace) {
      setIsDrawerOpen(true);
    }
  }, [selectedPlace]);

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 960);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, [setIsMobile]);

  useEffect(() => {
    const storedToast = localStorage.getItem("accountCreatedToast");
    if (storedToast) {
      const toastData = JSON.parse(storedToast);
      toast(toastData);
      localStorage.removeItem("accountCreatedToast");
    }
  }, [toast]);

  return (
    <div className="flex flex-col h-full">
      <ActionToolBar />

      {/* Main Content Area */}
      <div className="flex-grow overflow-hidden flex relative">
        {/* List View */}
        <div
          className={`h-full overflow-hidden transition-all duration-300 ease-in-out
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
          <div className="h-full overflow-auto p-4">
            <ListView />
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
        {isMobile && selectedPlace && (
          <PlaceDetailDrawer
            place={selectedPlace}
            isOpen={isDrawerOpen}
            onClose={handleCloseDrawer}
          />
        )}

        {/* Floating View Toggle Button (Mobile Only) */}
        {isMobile && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <ViewToggleButton />
          </div>
        )}
      </div>
    </div>
  );
}
