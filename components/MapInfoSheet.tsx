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
import ImageUploader from "./ui/ImageUploader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

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
  onSpotCreated: () => void;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  image: z.instanceof(File).optional(),
});

function MapInfoSheet({
  isOpen,
  onOpenChange,
  markerPosition,
  onSpotCreated,
}: MapInfoSheetProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
    },
  });

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

  const renderCategorySelection = () => {
    const rootCategories = categories.filter(
      (category) => !category.parent_spot_category
    );

    return (
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {rootCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!markerPosition) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Marker position is missing",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", values.title);
      formData.append("lat", markerPosition.lat.toString());
      formData.append("lng", markerPosition.lng.toString());
      formData.append("category", values.category);
      formData.append("isVerified", "false");

      if (values.image) {
        formData.append("image", values.image);
      }

      const newSpot = await pb.collection("spots").create(formData);

      console.log("New spot created:", newSpot);
      toast({
        title: "Success",
        description: "Spot created successfully! It will be verified soon.",
      });

      form.reset();
      onOpenChange(false);
      onSpotCreated();
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="py-4 space-y-4">
              {markerPosition && (
                <p className="text-gray-700">
                  Latitude: {markerPosition.lat.toFixed(6)}, Longitude:{" "}
                  {markerPosition.lng.toFixed(6)}
                </p>
              )}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {renderCategorySelection()}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <ImageUploader
                        onImageSelected={(file: File) => form.setValue("image", file)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <SheetFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button type="submit">Save</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default MapInfoSheet;
