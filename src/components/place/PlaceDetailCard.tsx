import { Card } from "@/src/components/ui/card";
import { Place } from "../../types/custom.types";
import PlaceDetailInfo from "./PlaceDetailInfo";

export default function PlaceDetailCard({ place }: { place: Place }) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <PlaceDetailInfo place={place} />
    </Card>
  );
}
