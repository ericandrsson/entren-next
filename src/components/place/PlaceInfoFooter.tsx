import { Button } from "@/src/components/ui/button";
import { Place } from "@/src/types/custom.types";
import { AlertTriangle, MapPin, PlusCircle } from "lucide-react";

interface PlaceInfoFooterProps {
  place: Place;
  entranceCount: number;
  onAddEntrance: () => void;
}

export default function PlaceInfoFooter({ place, entranceCount, onAddEntrance }: PlaceInfoFooterProps) {
  return (
    <section aria-labelledby="actions-heading" className="w-full">
      <h2 id="actions-heading" className="sr-only">
        User Actions
      </h2>
      <div className="flex w-full flex-col items-center space-y-4">
        <Button
          className="flex h-12 w-full items-center justify-center bg-blue-500 text-white transition-colors duration-200 hover:bg-blue-600"
          onClick={onAddEntrance}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Lägg till ny entré
        </Button>
        <Button
          variant="outline"
          className="flex h-12 w-full items-center justify-center"
          onClick={() => {
            /* Add your report problem logic here */
          }}
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Rapportera ett problem
        </Button>
        <Button
          variant="outline"
          className="flex h-12 w-full items-center justify-center"
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
