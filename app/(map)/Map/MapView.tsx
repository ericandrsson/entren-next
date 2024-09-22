import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMapStore } from "@/app/lib/mapStore";
import { Skeleton } from "@/components/ui/skeleton";

const MapWithNoSSR = dynamic(() => import("@/app/(map)/Map/Map"), {
  loading: () => <Skeleton className="w-full h-full rounded-lg" />,
  ssr: false,
});

export default function MapView() {
  const { isListCollapsed, toggleListCollapse, isMobile } = useMapStore();

  return (
    <div className="p-4 h-full relative">
      <div className="w-full h-full rounded-lg overflow-hidden relative z-0">
        <MapWithNoSSR />
      </div>
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
