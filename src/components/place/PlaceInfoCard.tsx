import { Card, CardContent, CardFooter } from "@/src/components/ui/card";
import { useState } from "react";
import { Entrance, EntrancePhoto, Place } from "../../types/custom.types";
import PlaceInfoContent from "./PlaceInfoContent";
import PlaceInfoFooter from "./PlaceInfoFooter";
import PlaceInfoHeader from "./PlaceInfoHeader";

export default function PlaceInfoCard({
  place,
  entrances,
  allPlacePhotos,
  isLoading,
  onAddEntrance,
}: {
  place: Place;
  entrances: Entrance[];
  allPlacePhotos: EntrancePhoto[];
  isLoading: boolean;
  onAddEntrance: () => void;
}) {
  const [entranceCount, setEntranceCount] = useState(entrances.length);

  return (
    <Card className="flex flex-col h-[calc(100vh-500px)]">
      <PlaceInfoHeader place={place} />
      <CardContent className="flex-grow overflow-hidden p-0">
        <PlaceInfoContent
          place={place}
          entrances={entrances}
          allPlacePhotos={allPlacePhotos}
          isLoading={isLoading}
          onEntranceCountChange={(count) => setEntranceCount(count)}
        />
      </CardContent>
      <CardFooter>
        <PlaceInfoFooter
          place={place}
          entranceCount={entranceCount}
          onAddEntrance={onAddEntrance}
        />
      </CardFooter>
    </Card>
  );
}
