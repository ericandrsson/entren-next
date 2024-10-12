import { Card } from "@/src/components/ui/card";
import { Place } from "../../types/custom.types";
import PlaceInfo from "./PlaceInfo";

// Type guard function
function isPlace(place: Place): place is Place {
  return "place_id" in place;
}

export default function PlaceInfoCard({ place }: { place: Place }) {
  return (
    <Card className="w-full max-w-3xl mx-auto relative">
      <PlaceInfo place={place} />
    </Card>
  );
}
