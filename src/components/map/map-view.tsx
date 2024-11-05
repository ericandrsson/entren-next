import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useStore } from "@/src/libs/store";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import PlaceInfoContainer from "../place/PlaceInfoContainer";

const MapWithNoSSR = dynamic(() => import("@/src/components/map/map"), {
  loading: () => <Skeleton className="h-full w-full rounded-lg" />,
  ssr: false,
});

export default function MapView() {
  const { view, toggleListVisibility, isMobile, selectedPlace } = useStore();

  return (
    <div className="relative h-full p-4">
      <div className="relative z-0 h-full w-full overflow-hidden rounded-lg">
        <MapWithNoSSR />
      </div>
      <PlaceInfoContainer place={selectedPlace} />

      <Button variant="outline" size="icon" className="absolute left-8 top-8 z-10" onClick={toggleListVisibility}>
        {(isMobile && view === "list") || (!isMobile && view === "both") ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
