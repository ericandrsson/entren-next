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
  DoorOpen,
  DoorClosed,
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
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';

const log = logger.child({ module: "PlaceInfo" });

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "coffee shop":
      return <Coffee className="w-5 h-5" />;
    default:
      return <MapPin className="w-5 h-5" />;
  }
};

const getEntranceTypeIcon = (entranceType: string) => {
  switch (entranceType.toLowerCase()) {
    case 'huvudentré':
      return <DoorOpen className="w-4 h-4" />;
    case 'sidoentré':
      return <DoorClosed className="w-4 h-4" />;
    default:
      return <MapPin className="w-4 h-4" />;
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
          entrance.status !== "pending" || entrance.created_by === user?.id,
      );

      setEntrances(filteredEntrances);
      if (filteredEntrances.length > 0) {
        setExpandedEntrance(filteredEntrances[0].entrance_id);
      }
      setAllPlacePhotos(
        filteredEntrances.flatMap((e) => e.photos as EntrancePhoto[]),
      );
      log.info("entrances fetched and filtered successfully", {
        placeId: place.place_id,
        entranceCount: filteredEntrances.length,
        photoCount: filteredEntrances.flatMap(
          (e) => e.photos as EntrancePhoto[],
        ).length,
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
      return <div>Loading...</div>;
    }

    if (entrances.length > 0) {
      const verifiedEntrances = entrances.filter(e => e.status !== 'pending');
      const pendingEntrances = entrances.filter(e => e.status === 'pending');

      return (
        <section aria-labelledby="entrances-heading" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 id="entrances-heading" className="text-xl font-bold">
              Entréer
            </h2>
            <Button variant="outline" size="sm" onClick={handleAddEntrance}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Lägg till en ny entré
            </Button>
          </div>
          
          {verifiedEntrances.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Verifierade entréer</h3>
              <ul className="space-y-4">
                {verifiedEntrances.map((entrance) => (
                  <EntranceItem key={entrance.entrance_id} entrance={entrance} isVerified={true} />
                ))}
              </ul>
            </div>
          )}
          
          {pendingEntrances.length > 0 && (
            <div className="space-y-4 mt-8">
              <h3 className="text-lg font-semibold">Väntande entréer</h3>
              <ul className="space-y-4">
                {pendingEntrances.map((entrance) => (
                  <EntranceItem key={`pending-${entrance.entrance_id}`} entrance={entrance} isVerified={false} />
                ))}
              </ul>
            </div>
          )}

          {verifiedEntrances.length === 0 && pendingEntrances.length === 0 && (
            <p>No entrances found.</p>
          )}
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

  const EntranceItem = ({ entrance, isVerified }: { entrance: DetailedEntrance, isVerified: boolean }) => (
    <li>
      <Collapsible
        open={expandedEntrance === entrance.entrance_id}
        onOpenChange={() => handleEntranceExpand(entrance.entrance_id!)}
      >
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center">
              {getEntranceTypeIcon(entrance.entrance_type_name_sv)}
              <span className="ml-2">{entrance.entrance_type_name_sv}</span>
              {!isVerified && (
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
            </span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-2">
          {!isVerified && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
              <p className="text-sm font-medium text-yellow-700">
                <Clock className="inline-block w-4 h-4 mr-2" />
                Väntar på verifiering
              </p>
              <p className="text-xs text-yellow-600 mt-1">
                Inskickad {formatDistanceToNow(new Date(entrance.created_at), { addSuffix: true, locale: sv })}
              </p>
              <p className="text-xs text-yellow-600">
                Granskning tar vanligtvis 24-48 timmar
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 gap-2 mb-2">
            {entrance.photos?.map((photo: EntrancePhoto) => (
              <div key={photo.photo_id} className="relative">
                <Button
                  variant="ghost"
                  className="p-0 w-full h-auto"
                  onClick={() => handlePhotoClick(allPlacePhotos.findIndex(p => p.photo_id === photo.photo_id))}
                >
                  <Image
                    src={photo.photo_url}
                    alt={photo.description || ""}
                    width={300}
                    height={200}
                    className="rounded-md object-cover w-full max-w-[300px] max-h-[200px]"
                  />
                </Button>
                {!isVerified && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full opacity-75">
                    Väntar på granskning
                  </div>
                )}
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );

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