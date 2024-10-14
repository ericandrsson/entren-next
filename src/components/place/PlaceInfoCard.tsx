import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Place } from "../../types/custom.types";
import PlaceInfo from "./PlaceInfo";

export default function PlaceInfoCard({ place }: { place: Place }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{place.name}</CardTitle>
      </CardHeader>
      <PlaceInfo place={place} />
    </Card>
  );
}
