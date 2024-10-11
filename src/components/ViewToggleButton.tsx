import { Button } from "@/src/components/ui/button";
import { useStore } from "@/src/libs/store";
import { List, MapPin } from "lucide-react";

export default function ViewToggleButton() {
  const { view, setView } = useStore();

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
          Visa karta
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
