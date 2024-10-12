import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";

export default function AddLocationButton() {
  return (
    <Button className="flex items-center justify-center space-x-2">
      <PlusCircle className="w-4 h-4" />
      <span>Lägg till plats</span>
    </Button>
  );
}
