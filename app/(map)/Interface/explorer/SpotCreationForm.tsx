import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { pb } from "@/lib/db";
import { useToast } from "@/hooks/use-toast";
import ImageUploader from "@/components/ui/image-uploader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Camera } from "lucide-react";
import { UnverifiedNode } from "@/types";

interface Category {
  id: string;
  name: string;
  icon: string;
  parent_spot_category: string | null;
}

interface SpotCreationFormProps {
  onClose: () => void;
  onSpotCreated: () => void;
  initialData: UnverifiedNode | null;
}

const formSchema = z.object({
  title: z.string().min(1, "Titel är obligatorisk"),
  mainCategory: z.string().min(1, "Huvudkategori är obligatorisk"),
  subCategory: z.string().optional(),
  image: z.instanceof(File, { message: "En bild är obligatorisk" }),
  source: z.string(),
  data: z.any().optional(),
  osmId: z.string().optional(),
  osmType: z.string().optional(),
});

function SpotCreationForm({ onClose, onSpotCreated, initialData }: SpotCreationFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.tags.name || "",
      mainCategory: "",
      subCategory: "",
      source: "unverified_node",
      data: initialData,
      osmId: initialData?.id,
      osmType: initialData?.type,
    },
  });

  // ... (keep the fetchCategories, getChildCategories, and renderCategorySelection functions)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!initialData) {
      toast({
        variant: "destructive",
        title: "Fel",
        description: "Ingen obekräftad plats vald",
        className: "bg-white border border-gray-200 text-gray-900",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", values.title);
      formData.append("lat", initialData.lat.toString());
      formData.append("lng", initialData.lon.toString());
      formData.append("category", values.subCategory || values.mainCategory);
      formData.append("isVerified", "true");

      if (values.image) {
        formData.append("image", values.image);
      }

      if (values.osmId) formData.append("osm_id", values.osmId);
      if (values.osmType) formData.append("osm_type", values.osmType);
      formData.append("source", values.source);
      if (values.data) formData.append("data", JSON.stringify(values.data));

      const newSpot = await pb.collection("spots").create(formData);

      console.log("New spot created:", newSpot);
      toast({
        title: "✨ Tack!",
        description: "Entrén har lagts till och verifierats.",
        duration: 5000,
        className: "bg-white border border-gray-200 text-gray-900",
      });

      form.reset();
      onClose();
      onSpotCreated();
    } catch (error) {
      console.error("Error creating spot:", error);
      toast({
        variant: "destructive",
        title: "Fel",
        description: "Kunde inte skapa platsen. Försök igen.",
        className: "bg-white border border-gray-200 text-gray-900",
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4">Verifiera plats</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-grow">
          <div className="flex-grow overflow-y-auto">
            {/* ... (keep the form fields from SpotCreationSheet.tsx) */}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={onClose}>Avbryt</Button>
            <Button type="submit">Verifiera plats</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default SpotCreationForm;