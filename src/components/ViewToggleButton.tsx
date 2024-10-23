import { Button } from "@/src/components/ui/button";
import { useStore } from "@/src/libs/store";
import { List, MapPin } from "lucide-react";

export default function ViewToggleButton() {
  const { view, setView } = useStore();

  return (
    <Button
      variant="default"
      size="lg"
      className="rounded-full text-white shadow-lg"
      onClick={() => setView(view === "list" ? "map" : "list")}
    >
      {view === "list" ? (
        <>
          <MapPin className="mr-2 h-4 w-4" />
          Visa karta
        </>
      ) : (
        <>
          <List className="mr-2 h-4 w-4" />
          Visa lista
        </>
      )}
    </Button>
  );
}
