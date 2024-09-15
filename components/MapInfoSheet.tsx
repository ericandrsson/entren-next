import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LatLng } from "leaflet";
import { pb } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
interface Category {
  id: string;
  name: string;
  icon: string;
  parent_spot_category: string | null;
}

interface MapInfoSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  markerPosition: LatLng | null;
}

function MapInfoSheet({
  isOpen,
  onOpenChange,
  markerPosition,
}: MapInfoSheetProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await pb
          .collection("spot_categories")
          .getFullList<Category>();
        setCategories(result);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const getChildCategories = (parentId: string | null) => {
    return categories.filter(
      (category) => category.parent_spot_category === parentId
    );
  };

  const handleCategorySelect = (categoryId: string, level: number) => {
    setSelectedCategory((prev) => {
      const newSelection = [...prev.slice(0, level), categoryId];
      return newSelection.length > 2 ? newSelection.slice(-2) : newSelection;
    });
  };

  const renderCategorySelection = () => {
    const rootCategories = categories.filter(
      (category) => !category.parent_spot_category
    );

    return (
      <div className="space-y-4">
        <Select
          onValueChange={(value) => handleCategorySelect(value, 0)}
          value={selectedCategory[0] || ""}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select main category" />
          </SelectTrigger>
          <SelectContent>
            {rootCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedCategory[0] && (
          <Select
            onValueChange={(value) => handleCategorySelect(value, 1)}
            value={selectedCategory[1] || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select sub-category" />
            </SelectTrigger>
            <SelectContent>
              {getChildCategories(selectedCategory[0]).map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
  };

  const handleSave = async () => {
    if (!markerPosition || !title || selectedCategory.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields",
      });
      return;
    }

    try {
      const newSpot = await pb.collection("spots").create({
        name: title,
        lat: markerPosition.lat,
        lng: markerPosition.lng,
        category: selectedCategory[selectedCategory.length - 1], // Use the last selected category (sub-category if available)
      });

      console.log("New spot created:", newSpot);
      toast({
        title: "Success",
        description: "Spot created successfully!",
      });

      // Reset form and close sheet
      setTitle("");
      setSelectedCategory([]);
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating spot:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create spot. Please try again.",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[400px] sm:w-[540px] max-w-[100vw] bg-white text-gray-800"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-gray-900">
            Add New Place
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Enter details about this location.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-4">
          {markerPosition && (
            <p className="text-gray-700">
              Latitude: {markerPosition.lat.toFixed(6)}, Longitude:{" "}
              {markerPosition.lng.toFixed(6)}
            </p>
          )}
          <Input
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          {renderCategorySelection()}
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button variant="default" onClick={handleSave}>
            Save
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default MapInfoSheet;
