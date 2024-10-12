import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useStore } from "@/src/libs/store";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import PlaceInfoCard from "../place/PlaceInfoCard";

const MapWithNoSSR = dynamic(() => import("@/src/components/map/Map"), {
  loading: () => <Skeleton className="w-full h-full rounded-lg" />,
  ssr: false,
});

export default function MapView() {
  const { view, toggleListVisibility, isMobile, selectedPlace } = useStore();

  return (
    <div className="p-4 h-full relative">
      <div className="w-full h-full rounded-lg overflow-hidden relative z-0">
        <MapWithNoSSR />
      </div>
      {!isMobile && selectedPlace && (
        <div className="absolute bottom-8 left-8 z-10 max-w-sm">
          <PlaceInfoCard place={selectedPlace} />
        </div>
      )}

      <Button
        variant="outline"
        size="icon"
        className="absolute top-8 left-8 z-10"
        onClick={toggleListVisibility}
      >
        {(isMobile && view === "list") || (!isMobile && view === "both") ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
