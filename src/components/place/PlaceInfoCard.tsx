import { Card, CardContent, CardFooter } from "@/src/components/ui/card";
import { Place } from "../../types/custom.types";
import PlaceInfoContent from "./PlaceInfoContent";
import PlaceInfoFooter from "./PlaceInfoFooter";
import PlaceInfoHeader from "./PlaceInfoHeader";

export default function PlaceInfoCard({ place }: { place: Place }) {
  return (
    <Card className="flex flex-col h-[calc(100vh-400px)]">
      {/* Adjust the height as needed */}
      <PlaceInfoHeader place={place} />
      <CardContent className="flex-grow overflow-hidden p-0">
        <PlaceInfoContent place={place} />
      </CardContent>
      <CardFooter>
        <PlaceInfoFooter />
      </CardFooter>
    </Card>
  );
}
