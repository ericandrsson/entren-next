"use client";

import ListView from "@/src/components/list/ListView";
import MapView from "@/src/components/map/MapView";
import PlaceInfoDrawer from "@/src/components/place/PlaceInfoDrawer";
import ActionToolBar from "@/src/components/toolbar/Toolbar";
import ViewToggleButton from "@/src/components/ViewToggleButton";
import { useToast } from "@/src/hooks/use-toast";
import { useStore } from "@/src/libs/store";
import { requestUserLocation } from "@/src/libs/utils";
import { useEffect, useRef } from "react";

export default function Page() {
  const {
    view,
    isMobile,
    setIsMobile,
    selectedPlace,
    setSelectedPlace,
    setView,
    userLocation,
    setUserLocation,
  } = useStore();

  const { toast } = useToast();

  // Initialize prevIsMobileRef with the current window width
  const prevIsMobileRef = useRef(window.innerWidth <= 960);

  useEffect(() => {
    const fetchUserLocation = async () => {
      const userLocation = await requestUserLocation();
      if (!userLocation) {
        toast({
          title: "Platsbestämning misslyckades",
          description: "Det gick inte att bestämma din exakta plats.",
          variant: "default",
        });
      } else {
        setUserLocation({
          latitude: userLocation[1],
          longitude: userLocation[0],
        });
      }
    };

    fetchUserLocation();
  }, [userLocation, toast]);

  useEffect(() => {
    const checkIsMobile = () => {
      const newIsMobile = window.innerWidth <= 960;
      if (newIsMobile !== prevIsMobileRef.current) {
        // The isMobile state has changed
        setIsMobile(newIsMobile);
        const currentView = useStore.getState().view;

        if (newIsMobile) {
          // Switched to mobile
          if (currentView === "both") {
            // "both" view isn't supported on mobile
            setView("list"); // Default to "list" on mobile
          }
        } else {
          // Switched to desktop
          if (currentView === "list") {
            // "list" view alone isn't ideal on desktop
            setView("both");
          }
        }
        // Update prevIsMobileRef to the new value
        prevIsMobileRef.current = newIsMobile;
      }
    };

    window.addEventListener("resize", checkIsMobile);

    // Initial check on mount
    checkIsMobile();

    return () => window.removeEventListener("resize", checkIsMobile);
  }, [setIsMobile, setView]);

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
                : view === "both"
                  ? "w-1/5"
                  : "w-0"
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
                : view === "both"
                  ? "w-4/5"
                  : "w-full"
            }`}
        >
          <MapView />
        </div>

        {/* PlaceDetailDrawer for mobile */}
        {isMobile && selectedPlace && (
          <PlaceInfoDrawer
            place={selectedPlace}
            isOpen={!!selectedPlace}
            onClose={() => setSelectedPlace(null)}
          />
        )}

        {/* Floating View Toggle Button (Mobile Only) */}
        {isMobile && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
            <ViewToggleButton />
          </div>
        )}
      </div>
    </div>
  );
}
