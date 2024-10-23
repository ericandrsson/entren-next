import { Coffee, MapPin } from "lucide-react";
import { Place } from "../../types/custom.types";
import { MainCategoryIcon } from "../Icon";

export default function PlaceInfoHeader({ place }: { place: Place }) {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "coffee shop":
        return <Coffee className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  return (
    <div className="grid w-full grid-cols-[auto,1fr] gap-x-4 p-4">
      <div className="row-span-2 flex items-center justify-center">
        <MainCategoryIcon category={place.parent_category_name as any} size="large" />
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
