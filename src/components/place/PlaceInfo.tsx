import { Button } from "@/src/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/src/components/ui/collapsible";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { logger } from "@/src/libs/logger";
import { createClient } from "@/utils/supabase/client";
import {
  AlertCircle,
  Clock,
  Coffee,
  Flag,
  Info,
  MapPin,
  PlusCircle,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import {
  DetailedEntrance,
  EntrancePhoto,
  Place,
} from "../../types/custom.types";
import AddEntranceDialog from "../entrance/AddEntranceDialog";
import LoginPromptDialog from "../LoginPromptDialog";
import PlacePhotoModal from "./PlacePhotoModal";

const log = logger.child({ module: "PlaceInfo" });

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "coffee shop":
      return <Coffee className="w-5 h-5" />;
    default:
      return <MapPin className="w-5 h-5" />;
  }
};

export default function PlaceInfo({ place }: { place: Place }) {
  const [expandedEntrance, setExpandedEntrance] = useState<number | null>(null);
  const [entrances, setEntrances] = useState<DetailedEntrance[]>([]);
  const [allPlacePhotos, setAllPlacePhotos] = useState<EntrancePhoto[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [isAddEntranceDialogOpen, setIsAddEntranceDialogOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const checkUserAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsUserAuthenticated(!!user);
      setUser(user);
      log.info("user authentication checked", { isAuthenticated: !!user });
    };

    checkUserAuth();
  }, []);

  useEffect(() => {
    const fetchEntrances = async () => {
      setIsLoading(true);
      log.info("fetching entrances", { placeId: place.place_id });
      const { data, error } = await supabase
        .from("detailed_entrances_view")
        .select("*")
        .eq("place_id", place.place_id);

      if (error) {
        log.error("error fetching entrances", {
          error: error.message,
          placeId: place.place_id,
        });
        setIsLoading(false);
        return;
      }

      const entrancesData = data as DetailedEntrance[];
      const filteredEntrances = entrancesData.filter(
        (entrance) =>
          entrance.status !== "pending" || entrance.created_by === user?.id
      );

      setEntrances(filteredEntrances);
      if (filteredEntrances.length > 0) {
        setExpandedEntrance(filteredEntrances[0].entrance_id);
      }
      setAllPlacePhotos(
        filteredEntrances.flatMap((e) => e.photos as EntrancePhoto[])
      );
      log.info("entrances fetched and filtered successfully", {
        placeId: place.place_id,
        entranceCount: filteredEntrances.length,
        photoCount: filteredEntrances.flatMap((e) => e.photos as EntrancePhoto[])
          .length,
      });
      setIsLoading(false);
    };

    fetchEntrances();
  }, [place.place_id, supabase, user]);

  const handleEntranceExpand = useCallback((entranceId: number) => {
    setExpandedEntrance((prev) => {
      const newState = prev === entranceId ? null : entranceId;
      log.debug("entrance expansion toggled", {
        entranceId,
        newState: newState ? "expanded" : "collapsed",
      });
      return newState;
    });
  }, []);

  const handlePhotoClick = (clickedPhotoIndex: number) => {
    setSelectedPhotoIndex(clickedPhotoIndex);
    setIsPhotoDialogOpen(true);
    log.debug("photo dialog opened", { photoIndex: clickedPhotoIndex });
  };

  const handleClosePhotoDialog = () => {
    setIsPhotoDialogOpen(false);
    setSelectedPhotoIndex(0);
    log.debug("photo dialog closed");
  };

  const handleAddEntrance = useCallback(() => {
    if (isUserAuthenticated) {
      setIsAddEntranceDialogOpen(true);
      log.info("add entrance dialog opened", { isAuthenticated: true });
    } else {
      setIsLoginPromptOpen(true);
      log.info("login prompt opened for add entrance", {
        isAuthenticated: false,
      });
    }
  }, [isUserAuthenticated]);

  const handleCloseAddEntranceDialog = () => {
    setIsAddEntranceDialogOpen(false);
    log.debug("add entrance dialog closed");
  };

  const handleSaveAndAddAnotherEntrance = () => {
    // Logic to save the entrance and reset the form
    // This will be implemented in the AddEntranceDialog component
    log.info("save and add another entrance requested");
  };

  const renderEntranceSection = () => {
    if (isLoading) {
      return <div>Loading...</div>; // Or a more sophisticated loading indicator
    }

    if (entrances.length > 0) {
      return (
        <section aria-labelledby="entrances-heading">
          <div className="flex justify-between items-center mb-4">
            <h2 id="entrances-heading" className="text-lg font-semibold">
              Entréer
            </h2>
            <Button variant="outline" size="sm" onClick={handleAddEntrance}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Lägg till en ny entré
            </Button>
          </div>
          <ul className="space-y-4">
            {entrances.map((entrance) => (
              <li key={entrance.entrance_id || `pending-${entrance.place_id}`}>
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
                        {entrance.status === "pending" && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Clock className="w-4 h-4 ml-2 text-yellow-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Väntar på verifiering</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="w-4 h-4 ml-2 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{entrance.entrance_type_description_sv}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-2">
                    {entrance.status === "pending" && (
                      <p className="text-sm mb-2 text-yellow-500 font-medium">
                        Denna entré väntar på verifiering
                      </p>
                    )}
                    <div className="grid grid-cols-1 gap-2 mb-2">
                      {entrance.photos?.map((photo: EntrancePhoto) => (
                        <Button
                          key={photo.photo_id}
                          variant="ghost"
                          className="p-0 w-full h-auto"
                          onClick={() =>
                            handlePhotoClick(
                              allPlacePhotos.findIndex(
                                (p) => p.photo_id === photo.photo_id,
                              ),
                            )
                          }
                        >
                          <Image
                            src={photo.photo_url}
                            alt={photo.description || ""}
                            width={300}
                            height={200}
                            className="rounded-md object-cover w-full max-w-[300px] max-h-[200px]"
                          />
                        </Button>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </li>
            ))}
          </ul>
        </section>
      );
    } else {
      return (
        <section
          aria-labelledby="no-entrances-heading"
          className="text-center py-6"
        >
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 id="no-entrances-heading" className="text-xl font-semibold mb-2">
            Oj då! Den här platsen saknar entréinformation
          </h2>
          <p className="text-muted-foreground mb-4">
            Vill du vara en tillgänglighetshjälte? Lägg till entréinformation
            och hjälp personer med barnvagnar, rullstolar, eller andra
            tillgänglighetsbehov att utforska platsen enklare. Det är som att ge
            platsen en välkomnande high-five för alla besökare!
          </p>
          <Button className="w-full sm:w-auto" onClick={handleAddEntrance}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Lägg till entré
          </Button>
        </section>
      );
    }
  };

  const handleCloseLoginPrompt = useCallback(() => {
    setIsLoginPromptOpen(false);
    log.debug("login prompt closed");
  }, []);

  return (
    <>
      <CardHeader>
        <div className="flex flex-col w-full">
          <div className="flex items-start space-x-2 w-full">
            {getCategoryIcon(place.category_name || "unknown")}
            <div className="flex-grow">
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
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <div className="space-y-6">
            {renderEntranceSection()}

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

      <AddEntranceDialog
        place={place}
        isOpen={isAddEntranceDialogOpen}
        onClose={handleCloseAddEntranceDialog}
        onSaveAndAddAnother={handleSaveAndAddAnotherEntrance}
      />

      <PlacePhotoModal
        photos={allPlacePhotos}
        initialPhotoIndex={selectedPhotoIndex}
        onClose={handleClosePhotoDialog}
        isOpen={isPhotoDialogOpen}
      />

      <LoginPromptDialog
        appName="Entrén"
        onClose={handleCloseLoginPrompt}
        isOpen={isLoginPromptOpen}
      />
    </>
  );
}
