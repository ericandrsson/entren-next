import { useStore } from "@/src/libs/store";
import { requestUserLocation } from "@/src/libs/utils";
import { MapPin } from "lucide-react";
import { Button } from "../../ui/button";

export default function LocateButton() {
  const setUserLocation = useStore((state) => state.setUserLocation);

  const handleLocate = async () => {
    const location = await requestUserLocation();
    if (location) {
      setUserLocation({ latitude: location[0], longitude: location[1] });
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full bg-white shadow-md hover:bg-gray-100"
      onClick={handleLocate}
      aria-label="Hitta min plats"
    >
      <MapPin className="h-5 w-5 text-gray-600" />
    </Button>
  );
}
