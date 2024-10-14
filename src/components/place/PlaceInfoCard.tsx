import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/src/components/ui/card";
import { Place } from "../../types/custom.types";
import PlaceInfoContent from "./PlaceInfoContent";
import PlaceInfoFooter from "./PlaceInfoFooter";
import PlaceInfoHeader from "./PlaceInfoHeader";

export default function PlaceInfoCard({ place }: { place: Place }) {
  return (
    <Card>
      <CardHeader>
        <PlaceInfoHeader place={place} />
      </CardHeader>
      <CardContent>
        <PlaceInfoContent place={place} />
      </CardContent>
      <CardFooter>
        <PlaceInfoFooter />
      </CardFooter>
    </Card>
  );
}
