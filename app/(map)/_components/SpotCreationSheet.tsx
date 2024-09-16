import { useEffect, useState, useCallback } from "react";
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
import ImageUploader from "../../../components/ui/image-uploader";
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
import { SearchResult } from "./SearchBar";

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
  selectedPlace: SearchResult | null;
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

function MapInfoSheet({
  isOpen,
  onOpenChange,
  markerPosition,
  onSpotCreated,
  selectedPlace,
}: MapInfoSheetProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      mainCategory: "",
      subCategory: "",
    },
  });

  const fetchCategories = useCallback(async () => {
    try {
      const result = await pb
        .collection("spot_categories")
        .getFullList<Category>({ sort: "name" });
      setCategories(result);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        variant: "destructive",
        title: "Fel",
        description: "Kunde inte ladda kategorier. Försök igen.",
      });
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, fetchCategories]);

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
      <>
        <FormField
          control={form.control}
          name="mainCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Huvudkategori</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedMainCategory(value);
                  form.setValue("subCategory", "");
                }}
                value={field.value}
              >
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
        {selectedMainCategory && (
          <FormField
            control={form.control}
            name="subCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Underkategori</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj en underkategori" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {getChildCategories(selectedMainCategory).map(
                      (category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <span className="mr-2">{category.icon}</span>
                          {category.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </>
    );
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!markerPosition) {
      toast({
        variant: "destructive",
        title: "Fel",
        description: "Markeringsposition saknas",
        className: "bg-white border border-gray-200 text-gray-900",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", values.title);
      formData.append("lat", markerPosition.lat.toString());
      formData.append("lng", markerPosition.lng.toString());
      formData.append("category", values.subCategory || values.mainCategory);
      formData.append("isVerified", "false");

      if (values.image) {
        formData.append("image", values.image);
      }

      if (values.osmId) formData.append("osm_id", values.osmId);
      if (values.osmType) formData.append("osm_type", values.osmType);
      formData.append("source", values.source);
      if (values.data) formData.append("data", JSON.stringify(values.data));

      console.log("Form data:", formData);

      const newSpot = await pb.collection("spots").create(formData);

      console.log("New spot created:", newSpot);
      toast({
        title: "✨ Tack!",
        description:
          "Entrén har lagts till och skickats in för granskning. Den behöver verifieras innan den syns på kartan.",
        duration: 5000,
        className: "bg-white border border-gray-200 text-gray-900",
      });

      form.reset();
      onOpenChange(false);
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
    if (isOpen && selectedPlace) {
      form.setValue("title", selectedPlace.display_name.split(",")[0]);
      form.setValue("osmId", selectedPlace.osm_id.toString());
      form.setValue("osmType", selectedPlace.osm_type);
      form.setValue("source", "nominatim");
      form.setValue("data", selectedPlace);
    } else if (isOpen) {
      form.setValue("source", "user");
    }
  }, [isOpen, selectedPlace, form]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[400px] sm:w-[540px] max-w-[100vw] bg-white text-gray-800 flex flex-col h-full p-0 overflow-hidden"
      >
        <SheetHeader className="p-6 flex-shrink-0">
          <SheetTitle className="text-2xl font-bold text-gray-900">
            Lägg till ny Entré
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            Hjälp andra att hitta och förstå tillgängligheten genom att fylla i
            informationen nedan.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-grow overflow-hidden">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col flex-grow overflow-hidden"
            >
              <div className="flex-grow overflow-y-auto px-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="pb-6">
                      <FormLabel className="text-lg font-semibold">
                        Titel på platsen
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Exempel: Café ABC eller Museet XYZ"
                          className="text-lg"
                        />
                      </FormControl>
                      <FormDescription>
                        Skriv vad platsen heter så att andra lätt kan känna igen
                        den.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {categories.length === 0 ? (
                  <p>Laddar kategorier...</p>
                ) : (
                  renderCategorySelection()
                )}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <FormLabel className="text-lg font-semibold">
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
                      <FormDescription>
                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                          <strong className="text-sm mb-2 block">
                            Riktlinjer för Bilden:
                          </strong>
                          <ul className="pl-5 m-0 list-disc">
                            <li>
                              <strong>Fokusera på entrén:</strong> Visa tydligt
                              dörren, ramper eller trappor.
                            </li>

                            <li>
                              <strong>Rakt framifrån:</strong> Placera entrén i
                              mitten av bilden.
                            </li>
                            <li>
                              <strong>Inga personer:</strong> Undvik att få med
                              människor på bilden.
                            </li>
                            <li>
                              <strong>Aktuell bild:</strong> Se till att bilden
                              visar hur entrén ser ut idag.
                            </li>
                          </ul>
                        </div>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <SheetFooter className="p-6 bg-white border-t flex-shrink-0 gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Avbryt
                </Button>
                <Button type="submit">Lägg till plats</Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MapInfoSheet;
