import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMapStore } from "../lib/mapStore";

export default function FilterButton() {
  const { setIsFilterOpen } = useMapStore();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsFilterOpen(true)}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">{/* Filter content */}</SheetContent>
    </Sheet>
  );
}
