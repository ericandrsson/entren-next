import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
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
import { useToast } from "@/src/hooks/use-toast";
import { logger } from "@/src/libs/logger";
import { cn } from "@/src/libs/utils";
import { EntranceType, Place } from "@/src/types/custom.types";
import { getGPSCoordinates } from "@/src/utils/imageMetadata";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, MapPin, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const log = logger.child({ module: "AddEntranceDialog" });

const entranceSchema = z.object({
  entranceType: z.string(),
  photo: z.any().optional(),
  location: z.object({
    lat: z.string().optional(),
    lng: z.string().optional(),
  }),
  sameAsPlaceLocation: z.boolean().default(false),
});

log.debug("entrance schema defined");

type EntranceFormData = z.infer<typeof entranceSchema>;

interface AddEntranceDialogProps {
  place: Place;
  isOpen: boolean;
  onClose: () => void;
  onSaveAndAddAnother: () => void;
}

const ImageGuidelines = ({ onConfirm }: { onConfirm: () => void }) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Följande bilder...</h3>
    <ul className="list-disc pl-5 space-y-2">
      <li>...ge användbar information om tillgängligheten.</li>
      <li>...togs av mig.</li>
      <li>... visar inga identifierbara personer.</li>
    </ul>
    <div className="flex items-center space-x-2">
      <Checkbox
        id="terms"
        onCheckedChange={(checked) => {
          log.debug({ checked }, "Image guidelines checkbox changed");
          if (checked) onConfirm();
        }}
      />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Jag publicerar härmed dessa bilder för allmänheten och avsäger mig
        copyright (
        <Link
          href="https://creativecommons.org/publicdomain/zero/1.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          universell CC0 1.0-licens
        </Link>
        ).
      </label>
    </div>
  </div>
);

export default function AddEntranceDialog({
  place,
  isOpen,
  onClose,
  onSaveAndAddAnother,
}: AddEntranceDialogProps) {
  log.debug({ place, isOpen }, "AddEntranceDialog rendered");

  const [step, setStep] = useState(1);
  const [hasLocationMetadata, setHasLocationMetadata] = useState(false);
  const [entranceTypes, setEntranceTypes] = useState<EntranceType[]>([]);
  const [entranceCounts, setEntranceCounts] = useState<Record<number, number>>(
    {},
  );

  const [guidelinesConfirmed, setGuidelinesConfirmed] = useState(false);
  const [sameAsPlaceLocation, setSameAsPlaceLocation] = useState(false);

  const { toast } = useToast();

  const fetchEntranceTypes = async () => {
    log.debug("fetching entrance types");
    const supabase = createClient();
    const { data, error } = await supabase
      .from("entrance_types")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      log.warn({ error }, "error fetching entrance types");
      toast({
        title: "Fel vid hämtning av entrétyper",
        description: "Kunde inte hämta entrétyper. Försök igen senare.",
        variant: "destructive",
      });
    } else {
      log.info({ count: data?.length }, "entrance types fetched successfully");
      setEntranceTypes(data || []);
    }
  };

  const fetchEntranceCounts = async () => {
    if (!place.place_id) {
      log.debug("no place_id, skipping entrance count fetch");
      setEntranceCounts({});
      return;
    }

    log.debug({ place_id: place.place_id }, "fetching entrance counts");
    const supabase = createClient();

    const { data, error } = await supabase.rpc("get_entrance_type_counts", {
      p_place_id: place.place_id,
    });

    if (error) {
      log.warn({ error }, "error fetching entrance counts");
      toast({
        title: "Fel vid hämtning av entréantal",
        description: "Kunde inte hämta antalet entréer. Försök igen senare.",
        variant: "destructive",
      });
      setEntranceCounts({});
    } else {
      const counts: Record<number, number> = {};
      data.forEach((item: { entrance_type_id: number; count: string }) => {
        counts[item.entrance_type_id] = parseInt(item.count);
      });
      log.info({ counts }, "entrance counts fetched successfully");
      setEntranceCounts(counts);
    }
  };

  const resetDialogState = () => {
    log.debug("resetting dialog state");
    setStep(1);
    setHasLocationMetadata(false);
    setGuidelinesConfirmed(false);
    setSameAsPlaceLocation(false);
    setEntranceCounts({});
    form.reset({
      entranceType: undefined,
      photo: undefined,
      location: { lat: "", lng: "" },
      sameAsPlaceLocation: false,
    });
  };

  useEffect(() => {
    log.debug({ isOpen }, "dialog open state changed");
    if (isOpen) {
      fetchEntranceTypes();
      fetchEntranceCounts();
    } else {
      resetDialogState();
    }
  }, [isOpen]);

  const form = useForm<EntranceFormData>({
    resolver: zodResolver(entranceSchema),
    defaultValues: {
      entranceType: undefined,
      photo: undefined,
      location: { lat: "", lng: "" },
      sameAsPlaceLocation: false,
    },
  });

  const handleEntranceTypeChange = (value: string) => {
    log.debug({ value }, "entrance type changed");
    form.setValue("entranceType", value);
    const isMainEntrance =
      entranceTypes.find((t) => t.id.toString() === value)?.name ===
      "Main Entrance";
    setSameAsPlaceLocation(isMainEntrance);
    form.setValue("sameAsPlaceLocation", isMainEntrance);
  };

  const handleSameAsPlaceLocationChange = (checked: boolean) => {
    log.debug({ checked }, "same as place location changed");
    setSameAsPlaceLocation(checked);
    form.setValue("sameAsPlaceLocation", checked);
    if (checked && place.lat && place.long) {
      form.setValue("location", {
        lat: place.lat.toString(),
        lng: place.long.toString(),
      });
      log.debug(
        { lat: place.lat, lng: place.long },
        "location set to place location",
      );
    }
  };

  const handleNext = () => {
    log.debug({ currentStep: step }, "moving to next step");
    if (step === 2 && sameAsPlaceLocation) {
      setStep(4); // Skip to review step
    } else if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    log.debug({ currentStep: step }, "moving to previous step");
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (data: EntranceFormData, addAnother: boolean) => {
    log.info({ data, addAnother }, "submitting entrance form");
    const supabase = createClient();
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      log.warn("user not logged in");
      toast({
        title: "Ej inloggad",
        description: "Du måste vara inloggad för att lägga till en entré.",
        variant: "destructive",
      });
      return;
    }

    try {
      let photoUrl = null;
      if (data.photo) {
        log.debug("uploading photo");
        const fileName = `entrance_${Date.now()}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("place_entrance_photos")
          .upload(fileName, data.photo);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("place_entrance_photos")
          .getPublicUrl(fileName);

        photoUrl = urlData.publicUrl;
        log.debug({ photoUrl }, "photo uploaded successfully");
      }

      const location = data.sameAsPlaceLocation
        ? { lat: place.lat, long: place.long }
        : {
            lat: parseFloat(data.location.lat!),
            long: parseFloat(data.location.lng!),
          };

      const changeData = {
        type_id: parseInt(data.entranceType),
        location: location,
        place_id: place.place_id,
        photo_url: photoUrl || null,
      };

      log.debug({ changeData }, "adding entity change");
      const { error } = await supabase.rpc("add_entity_change", {
        p_user_id: user.data.user.id,
        p_entity_id: place.place_id,
        p_entity_type: "entrance",
        p_action_type: "add",
        p_change_data: changeData,
      });

      if (error) {
        log.error({ error }, "error adding entity change");
        toast({
          title: "Fel vid sparande av entré",
          description:
            "Ett fel uppstod när entrén skulle sparas. Försök igen senare.",
          variant: "destructive",
        });
        return;
      }

      if (addAnother) {
        log.info("saving and adding another entrance");
        onSaveAndAddAnother();
        form.reset();
        setStep(1);
        toast({
          title: "Tack för ditt bidrag!",
          description:
            "Entrén har sparats och väntar på granskning. Du kan nu lägga till en till.",
        });
      } else {
        onClose();
        toast({
          title: "Tack för ditt bidrag! 🎉",
          description: (
            <div className="space-y-2">
              <p>
                Din entré har sparats och väntar nu på granskning. Vi uppskattar
                verkligen din insats!
              </p>
              <ul className="space-y-1">
                <li className="flex items-start">
                  <span className="mr-2">✅</span>
                  <span>
                    <strong>Granskning:</strong> Ditt bidrag kommer att
                    kontrolleras för att säkerställa kvaliteten.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">⏳</span>
                  <span>
                    <strong>Synlighet:</strong> Entrén kommer att visas så snart
                    den har godkänts.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🌟</span>
                  <span>
                    <strong>Karma-poäng:</strong> Du har tjänat karma-poäng för
                    ditt bidrag!
                  </span>
                </li>
              </ul>
            </div>
          ),
          duration: 60000,
        });
      }
    } catch (error) {
      log.error({ error }, "unexpected error while saving entrance");
      toast({
        title: "Fel vid sparande av entré",
        description: "Ett oväntat fel uppstod. Försök igen senare.",
        variant: "destructive",
      });
    }
  };

  const handleGuidelinesConfirm = () => {
    setGuidelinesConfirmed(true);
    log.debug("image guidelines confirmed");
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!guidelinesConfirmed) {
      log.debug("photo upload attempted without confirming guidelines");
      return;
    }

    const file = e.target.files?.[0];
    if (file) {
      form.setValue("photo", file);
      log.debug({ fileName: file.name, fileSize: file.size }, "photo selected");

      try {
        const coordinates = await getGPSCoordinates(file);
        if (coordinates.lat !== null && coordinates.lng !== null) {
          setHasLocationMetadata(true);
          form.setValue("location", {
            lat: coordinates.lat.toString(),
            lng: coordinates.lng.toString(),
          });
          log.debug({ coordinates }, "gps coordinates extracted from photo");
        } else {
          setHasLocationMetadata(false);
          log.debug("no gps coordinates found in photo");
          toast({
            title: "Ingen platsdata",
            description:
              "Bilden innehåller ingen platsinformation. Du behöver ange platsen manuellt.",
          });
        }
      } catch (error) {
        setHasLocationMetadata(false);
        log.error({ error }, "error reading image metadata");
        toast({
          title: "Fel vid läsning av bilddata",
          description:
            "Kunde inte läsa platsinformation från bilden. Du behöver ange platsen manuellt.",
          variant: "destructive",
        });
      }
    }
  };

  const handleClose = () => {
    resetDialogState();
    onClose();
    log.debug("dialog closed");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className={cn("w-[95vw] sm:w-[90vw] sm:max-w-[600px] max-h-[90vh]")}
      >
        <DialogHeader>
          <DialogTitle>Lägg till Entré</DialogTitle>
          <DialogDescription>
            Hjälp andra att hitta tillgängliga ingångar genom att lägga till
            entréinformation för {place.name}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => handleSubmit(data, false))}
          >
            <div className="grid gap-4 py-4">
              {step === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="entranceType"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="entrance-type">Välj typ av entré</Label>
                        <Select
                          onValueChange={handleEntranceTypeChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger id="entrance-type">
                              <SelectValue placeholder="Välj entrétyp" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {entranceTypes.map((type) => {
                              const count = entranceCounts[type.id] || 0;
                              const isDisabled =
                                type.max_per_place !== null &&
                                count >= type.max_per_place;

                              return (
                                <SelectItem
                                  key={type.id}
                                  value={type.id.toString()}
                                  disabled={isDisabled}
                                >
                                  {type.name_sv}{" "}
                                  {isDisabled
                                    ? `(Max ${type.max_per_place} nådd)`
                                    : ""}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sameAsPlaceLocation"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={sameAsPlaceLocation}
                            onCheckedChange={handleSameAsPlaceLocationChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Entrén har samma plats som {place.name}
                          </FormLabel>
                          <FormDescription>
                            Markera detta om entrén är på samma plats som
                            huvudbyggnaden.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Combined Photo upload and Guidelines step */}
              {step === 2 && (
                <div className="grid gap-4">
                  <Label>Lägg till en bild på entrén</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <ImageGuidelines onConfirm={handleGuidelinesConfirm} />
                    </div>
                    <div className="space-y-4">
                      <div
                        className="flex justify-center items-center h-[200px] bg-muted rounded-md cursor-pointer overflow-hidden"
                        onClick={() =>
                          guidelinesConfirmed &&
                          document.getElementById("photo-upload")?.click()
                        }
                      >
                        {form.watch("photo") ? (
                          <img
                            src={URL.createObjectURL(
                              form.watch("photo") as File,
                            )}
                            alt="Entrance"
                            className="max-h-full w-full object-cover rounded-md"
                          />
                        ) : (
                          <div className="relative w-full h-full">
                            <Image
                              src="/images/entranceImagePlaceholder.jpg"
                              alt="Entrance Placeholder"
                              layout="fill"
                              objectFit="contain"
                              className="opacity-50"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={() =>
                            guidelinesConfirmed &&
                            document.getElementById("photo-upload")?.click()
                          }
                          disabled={!guidelinesConfirmed}
                        >
                          <Upload className="mr-2 h-4 w-4" /> Ladda upp bild
                        </Button>
                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                          disabled={!guidelinesConfirmed}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          disabled={!guidelinesConfirmed}
                        >
                          <Camera className="mr-2 h-4 w-4" /> Ta foto
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Location step (now step 3) */}
              {step === 3 && !sameAsPlaceLocation && !hasLocationMetadata && (
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

              {/* Review step */}
              {((step === 3 && (sameAsPlaceLocation || hasLocationMetadata)) ||
                step === 4) && (
                <div className="grid gap-6">
                  <h3 className="text-xl font-semibold">Granska information</h3>

                  <div className="grid gap-4 p-4 border rounded-lg bg-muted">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Typ av entré
                      </h4>
                      <p className="text-lg font-semibold">
                        {entranceTypes.find(
                          (t) => t.id.toString() === form.watch("entranceType"),
                        )?.name_sv || "Inte vald"}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Plats
                      </h4>
                      {sameAsPlaceLocation ? (
                        <p className="text-lg font-semibold">
                          Samma plats som {place.name}
                        </p>
                      ) : (
                        <p className="text-lg font-semibold">
                          Lat: {form.watch("location.lat")}, Lng:{" "}
                          {form.watch("location.lng")}
                        </p>
                      )}
                    </div>

                    {form.watch("photo") && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">
                          Bild
                        </h4>
                        <div className="mt-2 flex justify-center">
                          <div className="relative w-48 h-64 overflow-hidden rounded-md">
                            <Image
                              src={URL.createObjectURL(
                                form.watch("photo") as File,
                              )}
                              alt="Entrance"
                              layout="fill"
                              objectFit="cover"
                              className="rounded-md"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>
                      Kontrollera att all information är korrekt innan du
                      sparar.
                    </p>
                    <p>
                      Du kan gå tillbaka och ändra information om något inte
                      stämmer.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              {step > 1 && (
                <Button type="button" variant="outline" onClick={handleBack}>
                  Tillbaka
                </Button>
              )}
              {step < (sameAsPlaceLocation || hasLocationMetadata ? 3 : 4) ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (step === 1 && !form.watch("entranceType")) ||
                    (step === 2 &&
                      (!guidelinesConfirmed || !form.watch("photo")))
                  }
                >
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
          Steg {step} av {sameAsPlaceLocation || hasLocationMetadata ? 3 : 4}
        </div>

        <div className="mt-2 text-center text-xs text-muted-foreground">
          Tack för din hjälp med att göra platser mer tillgängliga!
        </div>
      </DialogContent>
    </Dialog>
  );
}
