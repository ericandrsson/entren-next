import React from "react";
import ZoomButtons from "./controls/ZoomButtons";
import MapDetailToggle from "./controls/MapDetailToggle";
import MapExplorerContainer from "./explorer/MapExplorerContainer";
import ModeSwitcher from "./controls/ModeSwitcher";
import LocationButton from "./controls/LocationButton";
import { useMapStore } from "../Map/MapStore";

function MapInterface({ map }: { map: L.Map | undefined }) {
  const {
    isDetailed,
    setIsDetailed,
    selectedSpot,
    currentMode,
    setCurrentMode,
    handleSelectSpot,
    setSelectedSpot,
  } = useMapStore();

  const handleDetailToggle = () => setIsDetailed(!isDetailed);

  const handleCloseSpotDetails = () => setSelectedSpot(null);

  const handleFilterChange = (filters: any) => {
    // Implement filter change logic here
    console.log("Filters changed:", filters);
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-start w-full p-4 z-[1000]">
        <div className="pointer-events-auto order-2 sm:order-1 mt-4 sm:mt-0">
          <MapExplorerContainer
            onSelectSpot={handleSelectSpot}
            selectedSpot={selectedSpot}
            onCloseSpotDetails={handleCloseSpotDetails}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className="pointer-events-auto order-1 sm:order-2 sm:mb-0">
          <ModeSwitcher
            currentMode={currentMode}
            onModeChange={setCurrentMode}
          />
        </div>
        <div className="pointer-events-auto order-3 mt-4 sm:mt-0">
          <MapDetailToggle
            isDetailed={isDetailed}
            onToggle={handleDetailToggle}
          />
          <LocationButton map={map} />
        </div>
      </div>
      {map && (
        <div className="absolute bottom-4 right-4 z-[1000] hidden sm:block pointer-events-auto">
          <ZoomButtons map={map} />
        </div>
      )}
    </div>
  );
}

export default MapInterface;
