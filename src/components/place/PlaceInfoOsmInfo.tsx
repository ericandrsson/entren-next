import { Button } from "@/src/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { PlaceOsm } from "@/src/types/custom.types";
import { AlertTriangle, CheckCircle, Coffee, Flag, MapPin } from "lucide-react";

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "coffee shop":
      return <Coffee className="w-5 h-5" />;
    default:
      return <MapPin className="w-5 h-5" />;
  }
};

export default function PlaceInfoOsmInfo({ place }: { place: PlaceOsm }) {
  return (
    <>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-2">
            {getCategoryIcon(place.category_name || "unknown")}
            <div>
              <CardTitle className="text-2xl font-bold">{place.name}</CardTitle>
              <div className="flex items-center space-x-2">
                <p className="text-muted-foreground">
                  {place.category_name_sv}
                </p>
                <span className="text-muted-foreground">•</span>
                <p className="text-sm text-muted-foreground">placeholder</p>
              </div>
            </div>
          </div>
          <div className="flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span>Ej verifierad</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <div className="space-y-6">
            <section aria-labelledby="actions-heading">
              <h2 id="actions-heading" className="sr-only">
                User Actions
              </h2>
              <div className="space-y-2">
                <Button
                  variant="default"
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verifiera platsen
                </Button>
                <Button variant="outline" className="w-full">
                  <Flag className="mr-2 h-4 w-4" />
                  Rapportera platsen
                </Button>
                <Button variant="outline" className="w-full">
                  <MapPin className="mr-2 h-4 w-4" />
                  Öppna i kartor
                </Button>
              </div>
            </section>
          </div>
        </ScrollArea>
      </CardContent>
    </>
  );
}
