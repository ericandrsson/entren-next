import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import { EntranceType } from "@/src/types/custom.types";
import { getGPSCoordinates } from "@/src/utils/imageMetadata";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, MapPin, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const entranceSchema = z.object({
  entranceType: z.enum(["main", "side", "back", "ramp", "other"]),
  photo: z.instanceof(File).optional(),
  location: z.object({
    lat: z.string().optional(),
    lng: z.string().optional(),
  }),
  accessibilityDetails: z
    .string()
    .min(1, "Please provide accessibility details"),
});

type EntranceFormData = z.infer<typeof entranceSchema>;

interface AddEntranceDialogProps {
  placeName?: string;
  isOpen: boolean;
  onClose: () => void;
  onSaveAndAddAnother: () => void;
}

export default function AddEntranceDialog({
  placeName = "Place Name",
  isOpen,
  onClose,
  onSaveAndAddAnother,
}: AddEntranceDialogProps) {
  const [step, setStep] = useState(1);
  const [hasLocationMetadata, setHasLocationMetadata] = useState(false);
  const [entranceTypes, setEntranceTypes] = useState<EntranceType[]>([]);

  const fetchEntranceTypes = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("entrance_types")
      .select("id, name_sv")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error fetching entrance types:", error);
    } else {
      setEntranceTypes(data || []);
    }
  };

  useEffect(() => {
    fetchEntranceTypes();
  }, []);

  const form = useForm<EntranceFormData>({
    resolver: zodResolver(entranceSchema),
    defaultValues: {
      entranceType: undefined,
      photo: undefined,
      location: { lat: "", lng: "" },
      accessibilityDetails: "",
    },
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (data: EntranceFormData, addAnother: boolean) => {
    console.log(data);
    if (addAnother) {
      onSaveAndAddAnother();
      form.reset();
      setStep(1);
    } else {
      onClose();
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("photo", file);

      try {
        const coordinates = await getGPSCoordinates(file);
        console.log("coords", coordinates);
        if (coordinates.lat !== null && coordinates.lng !== null) {
          setHasLocationMetadata(true);
          form.setValue("location", {
            lat: coordinates.lat.toString(),
            lng: coordinates.lng.toString(),
          });
        } else {
          console.log("No coordinates found");
          setHasLocationMetadata(false);
        }
      } catch (error) {
        console.error("Error extracting GPS data:", error);
        setHasLocationMetadata(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lägg till Entré</DialogTitle>
          <DialogDescription>
            Hjälp andra att hitta tillgängliga ingångar genom att lägga till
            entréinformation för {placeName}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => handleSubmit(data, false))}
          >
            <div className="grid gap-4 py-4">
              {step === 1 && (
                <FormField
                  control={form.control}
                  name="entranceType"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="entrance-type">Välj typ av entré</Label>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger id="entrance-type">
                            <SelectValue placeholder="Välj entrétyp" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {entranceTypes.map((type) => (
                            <SelectItem
                              key={type.id}
                              value={type.id.toString()}
                            >
                              {type.name_sv}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Photo upload step */}
              {step === 2 && (
                <div className="grid gap-2">
                  <Label>Lägg till en bild på entrén</Label>
                  <div
                    className="flex justify-center items-center h-[200px] bg-muted rounded-md cursor-pointer"
                    onClick={() =>
                      document.getElementById("photo-upload")?.click()
                    }
                  >
                    {form.watch("photo") ? (
                      <img
                        src={URL.createObjectURL(form.watch("photo") as File)}
                        alt="Entrance"
                        className="max-h-full rounded-md"
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        Ingen bild uppladdad
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() =>
                        document.getElementById("photo-upload")?.click()
                      }
                    >
                      <Upload className="mr-2 h-4 w-4" /> Ladda upp bild
                    </Button>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />

                    <Button type="button" variant="outline">
                      <Camera className="mr-2 h-4 w-4" /> Ta foto
                    </Button>
                  </div>
                </div>
              )}

              {/* Location step */}
              {step === 3 && !hasLocationMetadata && (
                <div className="grid gap-2">
                  <Label>Markera platsen för entrén</Label>
                  <div className="h-[200px] bg-muted flex items-center justify-center rounded-md">
                    <MapPin className="h-8 w-8 text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">
                      Map Placeholder
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="location.lat"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Latitude"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location.lng"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Longitude"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Accessibility details step */}
              {((step === 3 && hasLocationMetadata) || step === 4) && (
                <FormField
                  control={form.control}
                  name="accessibilityDetails"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="accessibility-details">
                        Tillgänglighetsdetaljer
                      </Label>
                      <FormControl>
                        <Textarea
                          id="accessibility-details"
                          placeholder="Beskriv tillgängligheten för denna entré..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter>
              {step > 1 && (
                <Button type="button" variant="outline" onClick={handleBack}>
                  Tillbaka
                </Button>
              )}
              {step < (hasLocationMetadata ? 3 : 4) ? (
                <Button type="button" onClick={handleNext}>
                  Nästa
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button type="submit">Spara entré</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      form.handleSubmit((data) => handleSubmit(data, true))()
                    }
                  >
                    Spara och lägg till en till
                  </Button>
                </div>
              )}
            </DialogFooter>
          </form>
        </Form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Steg {step} av {hasLocationMetadata ? 3 : 4}
        </div>

        <div className="mt-2 text-center text-xs text-muted-foreground">
          Tack för din hjälp med att göra platser mer tillgängliga!
        </div>
      </DialogContent>
    </Dialog>
  );
}
