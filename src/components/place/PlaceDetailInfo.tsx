import { Button } from "@/src/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { createClient } from "@/utils/supabase/client";
import {
  AlertTriangle,
  Check,
  Coffee,
  Flag,
  Info,
  MapPin,
  Shield,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  Place,
  PlaceEntranceImage,
  PlaceEntranceWithImages,
} from "../../types/custom.types";
import { PhotoDialog } from "./PhotoDetailsDialog";

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "coffee shop":
      return <Coffee className="w-5 h-5" />;
    default:
      return <MapPin className="w-5 h-5" />;
  }
};

export default function PlaceDetailInfo({ place }: { place: Place }) {
  const [expandedEntrance, setExpandedEntrance] = useState<number | null>(null);
  const [entrances, setEntrances] = useState<PlaceEntranceWithImages[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PlaceEntranceImage | null>(
    null,
  );
  const [loadingImages, setLoadingImages] = useState<boolean>(false);

  const fetchEntranceImages = useCallback(async (entranceId: number) => {
    setLoadingImages(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("place_entrance_images")
      .select("*")
      .eq("entrance_id", entranceId);

    if (error) {
      console.error("Error fetching entrance images:", error);
      setLoadingImages(false);
      return [];
    }

    setLoadingImages(false);
    return (data as PlaceEntranceImage[]) || [];
  }, []);

  useEffect(() => {
    const fetchEntrances = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("detailed_entrances_view")
        .select("*")
        .eq("place_id", place.place_id);

      if (data) {
        setEntrances(data as PlaceEntranceWithImages[]);
      }
    };

    fetchEntrances();
  }, [place.place_id]);

  const getAccessibilityIcon = (accessibility: "full" | "partial" | "none") => {
    switch (accessibility) {
      case "full":
        return <Check className="text-green-500" />;
      case "partial":
        return <AlertTriangle className="text-orange-500" />;
      case "none":
        return <X className="text-red-500" />;
    }
  };

  const handleEntranceExpand = useCallback(
    async (entranceId: number) => {
      if (expandedEntrance === entranceId) {
        setExpandedEntrance(null);
      } else {
        setExpandedEntrance(entranceId);
        const entrance = entrances.find((e) => e.entrance_id === entranceId);
        console.log("finding entrance", entrance);
        if (entrance && !entrance.photos) {
          const images = await fetchEntranceImages(entranceId);
          setEntrances((prevEntrances) =>
            prevEntrances.map((e) =>
              e.entrance_id === entranceId ? { ...e, photos: images } : e,
            ),
          );
        }
      }
    },
    [expandedEntrance, entrances, fetchEntranceImages],
  );

  return (
    <>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-start space-x-2">
            {getCategoryIcon(place.category_name || "unknown")}
            <div>
              <CardTitle className="text-2xl font-bold">{place.name}</CardTitle>
              <div className="flex items-center space-x-2">
                <p className="text-muted-foreground">
                  {place.category_name_sv}
                </p>
                <span className="text-muted-foreground">•</span>
                <p className="text-sm text-muted-foreground">placeholder</p>
              </div>
            </div>
          </div>
          <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
            <Shield className="w-4 h-4 mr-1" />
            <span>Verifierad</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <div className="space-y-6">
            {entrances.length > 0 && (
              <section aria-labelledby="entrances-heading">
                <h2
                  id="entrances-heading"
                  className="text-lg font-semibold mb-2"
                >
                  Entrances
                </h2>
                <ul className="space-y-4">
                  {entrances.map((entrance) => (
                    <li key={entrance.entrance_id}>
                      <Collapsible
                        open={expandedEntrance === entrance.entrance_id}
                        onOpenChange={() =>
                          handleEntranceExpand(entrance.entrance_id!)
                        }
                      >
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            <span className="flex items-center">
                              {entrance.entrance_type_name_sv}
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="w-4 h-4 ml-2 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {
                                        (
                                          entrance.accessibility_info as {
                                            details?: string;
                                          }
                                        )?.details
                                      }
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </span>
                            {getAccessibilityIcon("full")}
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="p-2">
                          <p className="text-sm mb-2 font-medium">
                            {
                              (
                                entrance.accessibility_info as {
                                  details?: string;
                                }
                              )?.details
                            }
                          </p>
                          <div className="grid grid-cols-1 gap-2 mb-2">
                            {loadingImages ? (
                              <Skeleton className="w-full h-48" />
                            ) : (
                              entrance.photos?.map((photo) => (
                                <Button
                                  key={photo.id}
                                  variant="ghost"
                                  className="p-0 w-full h-auto"
                                  onClick={() => setSelectedPhoto(photo)}
                                >
                                  <Image
                                    src={photo.image_url!}
                                    alt={photo.description || ""}
                                    width={300}
                                    height={200}
                                    className="rounded-md object-cover w-full max-w-[300px] max-h-[200px]"
                                  />
                                </Button>
                              ))
                            )}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="actions-heading">
              <h2 id="actions-heading" className="sr-only">
                User Actions
              </h2>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  <Flag className="mr-2 h-4 w-4" />
                  Rapportera ett problem
                </Button>
                <Button variant="outline" className="w-full">
                  <MapPin className="mr-2 h-4 w-4" />
                  Öppna i Kartor
                </Button>
              </div>
            </section>
          </div>
        </ScrollArea>
      </CardContent>

      <PhotoDialog
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </>
  );
}
