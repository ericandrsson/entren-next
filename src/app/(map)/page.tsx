"use client";

import ListView from "@/src/components/list/ListView";
import MapView from "@/src/components/map/MapView";
import PlaceInfoDrawer from "@/src/components/place/PlaceInfoDrawer";
import ActionToolBar from "@/src/components/toolbar/Toolbar";
import ViewToggleButton from "@/src/components/ViewToggleButton";
import { useToast } from "@/src/hooks/use-toast";
import { useStore } from "@/src/libs/store";
import { requestUserLocation } from "@/src/libs/utils";
import { useEffect } from "react";

export default function Page() {
  const {
    view,
    isMobile,
    isListVisible,
    setIsMobile,
    selectedPlace,
    setSelectedPlace,
    setView,
    userLocation,
    setUserLocation,
  } = useStore();

  const { toast } = useToast();

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
          latitude: userLocation[0],
          longitude: userLocation[1],
        });
      }
    };

    fetchUserLocation();
  }, [userLocation, toast]);

  useEffect(() => {
    const checkIsMobile = () => {
      const newIsMobile = window.innerWidth <= 960;
      setIsMobile(newIsMobile);

      // Adjust view only if switching to mobile and current view is "map" or "list"
      if (newIsMobile && (view === "map" || view === "list")) {
        setView(view);
      }
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, [setIsMobile, view, setView]);

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
                : isListVisible
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
                : isListVisible
                  ? "w-full"
                  : "w-2/3"
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
