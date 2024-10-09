import { Button } from "@/src/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import { Filter } from "lucide-react";
import { useStore } from "../libs/store";

export default function FilterButton() {
  const { setIsFilterOpen } = useStore();

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
