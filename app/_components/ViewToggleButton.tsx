import { Button } from "@/components/ui/button";
import { MapPin, List } from "lucide-react";
import { useMapStore } from "@/app/lib/mapStore";

export default function ViewToggleButton() {
  const { view, setView } = useMapStore();

  return (
    <Button
      variant="default"
      size="lg"
      className="text-white rounded-full shadow-lg"
      onClick={() => setView(view === "list" ? "map" : "list")}
    >
      {view === "list" ? (
        <>
          <MapPin className="h-4 w-4 mr-2" />
          Visa på karta
        </>
      ) : (
        <>
          <List className="h-4 w-4 mr-2" />
          Visa lista
        </>
      )}
    </Button>
  );
}
