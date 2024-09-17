import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUploader from "@/components/ui/image-uploader";
import { Camera, X } from "lucide-react";
import { UnverifiedNode } from "../UnverifiedNodesLayer";

interface UnverifiedSpotPanelProps {
  node: UnverifiedNode;
  onClose: () => void;
  onSpotCreated: () => void;
  categories: Category[];
}

interface Category {
  id: string;
  name: string;
  icon: string;
  parent_spot_category: string | null;
}

const formSchema = z.object({
  title: z.string().min(1, "Titel är obligatorisk"),
  mainCategory: z.string().min(1, "Huvudkategori är obligatorisk"),
  subCategory: z.string().optional(),
  image: z.instanceof(File, { message: "En bild är obligatorisk" }),
});

function UnverifiedSpotPanel({ node, onClose, onSpotCreated, categories }: UnverifiedSpotPanelProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: node.tags.name || "",
      mainCategory: "",
      subCategory: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Implement spot creation logic here
    console.log("Creating spot with values:", values);
    onSpotCreated();
    onClose();
  };

  const renderCategorySelection = () => {
    const rootCategories = categories.filter(
      (category) => !category.parent_spot_category
    );

    return (
      <>
        <FormField
          control={form.control}
          name="mainCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Huvudkategori</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Välj en huvudkategori" />
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
        {/* Add subCategory selection here if needed */}
      </>
    );
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <header className="p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Verifiera plats</h1>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titel på platsen</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Exempel: Café ABC eller Museet XYZ" />
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
                <FormLabel>
                  <Camera className="inline-block mr-2" size={20} />
                  Ladda upp en bild på entrén
                </FormLabel>
                <FormControl>
                  <ImageUploader
                    onImageSelected={(file: File) =>
                      form.setValue("image", file)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Avbryt</Button>
            <Button type="submit">Verifiera plats</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default UnverifiedSpotPanel;