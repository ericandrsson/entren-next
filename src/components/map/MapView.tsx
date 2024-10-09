import PlaceDetail from "@/src/components/PlaceDetail"; // Import PlaceDetail component
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useStore } from "@/src/libs/store";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";

const MapWithNoSSR = dynamic(() => import("@/src/components/map/Map"), {
  loading: () => <Skeleton className="w-full h-full rounded-lg" />,
  ssr: false,
});

export default function MapView() {
  const { isListCollapsed, toggleListCollapse, isMobile, selectedSpot } =
    useStore();

  return (
    <div className="p-4 h-full relative">
      <div className="w-full h-full rounded-lg overflow-hidden relative z-0">
        <MapWithNoSSR />
      </div>
      // Conditionally render PlaceDetail on desktop when a spot is selected
      {!isMobile && selectedSpot && (
        <div className="absolute bottom-8 left-8 z-10 max-w-sm">
          <PlaceDetail />
        </div>
      )}
      {!isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="absolute top-8 left-8 z-10"
          onClick={toggleListCollapse}
        >
          {isListCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}
