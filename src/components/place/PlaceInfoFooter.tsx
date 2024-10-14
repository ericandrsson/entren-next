import { Button } from "@/src/components/ui/button";
import { Place } from "@/src/types/custom.types";
import { AlertTriangle, MapPin, PlusCircle } from "lucide-react";

interface PlaceInfoFooterProps {
  place: Place;
  entranceCount: number;
  onAddEntrance: () => void;
}

export default function PlaceInfoFooter({
  place,
  entranceCount,
  onAddEntrance,
}: PlaceInfoFooterProps) {
  return (
    <section aria-labelledby="actions-heading" className="w-full">
      <h2 id="actions-heading" className="sr-only">
        User Actions
      </h2>
      <div className="flex flex-col items-center space-y-4 w-full">
        <Button
          className="w-full h-12 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200"
          onClick={onAddEntrance}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Lägg till ny entré
        </Button>
        <Button
          variant="outline"
          className="w-full h-12 flex items-center justify-center"
          onClick={() => {
            /* Add your report problem logic here */
          }}
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Rapportera ett problem
        </Button>
        <Button
          variant="outline"
          className="w-full h-12 flex items-center justify-center"
          onClick={() => {
            /* Add your open in maps logic here */
          }}
        >
          <MapPin className="mr-2 h-4 w-4" />
          Öppna i Kartor
        </Button>
      </div>
    </section>
  );
}
