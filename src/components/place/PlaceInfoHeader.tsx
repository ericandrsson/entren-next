import { Coffee, MapPin } from "lucide-react";
import { Place } from "../../types/custom.types";

export default function PlaceInfoHeader({ place }: { place: Place }) {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "coffee shop":
        return <Coffee className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  return (
    <div className="grid grid-cols-[auto,1fr] gap-x-2 w-full p-4">
      <div className="row-span-2 flex items-center">
        {getCategoryIcon(place.category_name || "unknown")}
      </div>
      <div className="flex-grow">
        <h2 className="text-2xl font-bold">{place.name}</h2>
      </div>
      <div className="flex items-center">
        <p className="text-muted-foreground">{place.category_name_sv}</p>
      </div>
    </div>
  );
}
