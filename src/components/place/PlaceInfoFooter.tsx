import { Button } from "@/src/components/ui/button";
import { AlertTriangle, MapPin } from "lucide-react";

export default function PlaceInfoFooter() {
  return (
    <section aria-labelledby="actions-heading" className="w-full">
      <h2 id="actions-heading" className="sr-only">
        User Actions
      </h2>
      <div className="flex flex-col items-center space-y-4">
        <Button
          variant="outline"
          className="w-full max-w-md h-12 flex items-center justify-center"
          onClick={() => {
            /* Add your report problem logic here */
          }}
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Rapportera ett problem
        </Button>
        <Button
          variant="outline"
          className="w-full max-w-md h-12 flex items-center justify-center"
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
