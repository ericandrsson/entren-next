import { Card } from "@/src/components/ui/card";
import { Place, PlaceOsm } from "../../types/custom.types";
import PlaceInfo from "./PlaceInfo";
import PlaceInfoOsmInfo from "./PlaceInfoOsmInfo";

// Type guard function
function isPlace(place: Place | PlaceOsm): place is Place {
  return "place_id" in place;
}

export default function PlaceInfoCard({ place }: { place: Place | PlaceOsm }) {
  return (
    <Card className="w-full max-w-3xl mx-auto relative">
      {isPlace(place) ? (
        <PlaceInfo place={place} />
      ) : (
        <PlaceInfoOsmInfo place={place} />
      )}
    </Card>
  );
}
