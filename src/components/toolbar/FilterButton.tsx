import { Button } from "@/src/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { useStore } from "@/src/libs/store";
import { Filter } from "lucide-react";

export default function FilterButton() {
  const { setIsFilterOpen } = useStore();

  return (
    <Sheet>
      <SheetTitle>Filter</SheetTitle>
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
