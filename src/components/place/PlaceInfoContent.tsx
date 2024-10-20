import { Button } from "@/src/components/ui/button";
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
import { useStore } from "@/src/libs/store";
import { createClient } from "@/utils/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  DoorClosed,
  DoorOpen,
  Eye,
  Info,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Entrance, EntrancePhoto, Place } from "../../types/custom.types";
import AddEntranceDialog from "../entrance/AddEntranceDialog";
import LoginPromptDialog from "../LoginPromptDialog";
import PlacePhotoModal from "./PlacePhotoModal";

const log = logger.child({ module: "PlaceInfoContent" });

export default function PlaceInfoContent({
  place,
  entrances,
  allPlacePhotos,
  isLoading,
  onEntranceCountChange,
  onAddEntrance,
  onEntranceAdded, // Add this new prop
}: {
  place: Place;
  entrances: Entrance[];
  allPlacePhotos: EntrancePhoto[];
  isLoading: boolean;
  onEntranceCountChange: (count: number) => void;
  onAddEntrance: () => void;
  onEntranceAdded: () => void; // Add this new prop
}) {
  const {
    isAddEntranceDialogOpen,
    setIsAddEntranceDialogOpen,
    isLoginPromptOpen,
    setIsLoginPromptOpen,
    isUserAuthenticated,
  } = useStore();
  const [expandedEntrances, setExpandedEntrances] = useState<Set<number>>(
    new Set(),
  );
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  const getImageUrl = useCallback(
    (imagePath: string) => {
      const { data } = supabase.storage
        .from("entrance_photos")
        .getPublicUrl(imagePath, {
          transform: {
            width: 300,
            height: 200,
            resize: "cover",
          },
        });
      return data?.publicUrl;
    },
    [supabase],
  );

  useEffect(() => {
    const checkUserAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      log.info("user authentication checked", { isAuthenticated: !!user });
    };

    checkUserAuth();
  }, []);

  useEffect(() => {
    onEntranceCountChange(entrances.length);
  }, [entrances, onEntranceCountChange]);

  const handleEntranceExpand = useCallback((entranceId: number) => {
    setExpandedEntrances((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(entranceId)) {
        newSet.delete(entranceId);
        log.debug("entrance expansion toggled", {
          entranceId,
          newState: "collapsed",
        });
      } else {
        newSet.add(entranceId);
        log.debug("entrance expansion toggled", {
          entranceId,
          newState: "expanded",
        });
      }
      return newSet;
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

  const handleAddEntranceClick = useCallback(() => {
    if (isUserAuthenticated) {
      setIsAddEntranceDialogOpen(true);
      log.info("add entrance dialog opened", { isAuthenticated: true });
    } else {
      setIsLoginPromptOpen(true);
      log.info("login prompt opened for add entrance", {
        isAuthenticated: false,
      });
    }
  }, [isUserAuthenticated, setIsAddEntranceDialogOpen, setIsLoginPromptOpen]);

  const handleCloseAddEntranceDialog = () => {
    setIsAddEntranceDialogOpen(false);
    log.debug("add entrance dialog closed");
  };

  const handleSaveAndAddAnotherEntrance = () => {
    // Logic to save the entrance and reset the form
    // This will be implemented in the AddEntranceDialog component
    log.info("save and add another entrance requested");
  };

  const handleCloseLoginPrompt = useCallback(() => {
    setIsLoginPromptOpen(false);
    log.debug("login prompt closed");
  }, [setIsLoginPromptOpen]);

  const getEntranceTypeIcon = (entranceType: string) => {
    switch (entranceType.toLowerCase()) {
      case "huvudentré":
        return <DoorOpen className="w-6 h-6 text-blue-600" />;
      case "sidoentré":
        return <DoorClosed className="w-6 h-6 text-green-600" />;
      default:
        return <MapPin className="w-6 h-6 text-gray-600" />;
    }
  };

  const renderEntranceSection = () => {
    if (isLoading) {
      return <div className="py-4">Loading...</div>;
    }

    if (entrances.length === 0) {
      return (
        <div className="text-center py-6">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Oj då! Den här platsen saknar entréinformation
          </h2>
          <p className="text-muted-foreground mb-4">
            Vill du vara en tillgänglighetshjälte? Lägg till entréinformation
            och hjälp personer med barnvagnar, rullstolar, eller andra
            tillgänglighetsbehov att utforska platsen enklare. Det är som att ge
            platsen en välkomnande high-five för alla besökare!
          </p>
        </div>
      );
    }

    const verifiedEntrances = entrances.filter((e) => e.status !== "pending");
    const pendingEntrances = entrances.filter((e) => e.status === "pending");

    return (
      <>
        {verifiedEntrances.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Verifierade entréer
            </h3>
            <ul className="space-y-4">
              {verifiedEntrances.map((entrance) => (
                <EntranceItem
                  key={entrance.entrance_id}
                  entrance={entrance}
                  isVerified={true}
                />
              ))}
            </ul>
          </div>
        )}

        {pendingEntrances.length > 0 && (
          <div className="space-y-4 mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold flex items-center">
              <Clock className="w-5 h-5 mr-2 text-yellow-600" />
              Obekräftade entréer
            </h3>
            <p className="text-sm text-gray-500 italic mb-2">
              Endast synligt för dig
            </p>
            <ul className="space-y-4">
              {pendingEntrances.map((entrance) => (
                <EntranceItem
                  key={`pending-${entrance.entrance_id}`}
                  entrance={entrance}
                  isVerified={false}
                />
              ))}
            </ul>
          </div>
        )}
      </>
    );
  };

  const EntranceItem = ({
    entrance,
    isVerified,
  }: {
    entrance: Entrance;
    isVerified: boolean;
  }) => {
    const isExpanded = expandedEntrances.has(entrance.entrance_id!);

    return (
      <li
        className={`rounded-lg overflow-hidden ${isVerified ? "bg-white" : "bg-yellow-50"}`}
      >
        <Collapsible
          open={isExpanded}
          onOpenChange={() => handleEntranceExpand(entrance.entrance_id!)}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-4">
              <span className="flex items-center">
                {getEntranceTypeIcon(entrance.entrance_type_name_sv || "")}
                <span className="ml-2">{entrance.entrance_type_name_sv}</span>
                {isVerified ? (
                  <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
                ) : (
                  <>
                    <Clock className="w-4 h-4 ml-2 text-yellow-600" />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Eye className="w-4 h-4 ml-2 text-blue-600" />
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          align="center"
                          className="max-w-xs"
                        >
                          <p>
                            This entrance is only visible to you until it is
                            verified.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 ml-2 text-blue-600" />
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      align="center"
                      className="max-w-xs"
                    >
                      <p>{entrance.entrance_type_description_sv}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4">
            {!isVerified && (
              <div className="bg-yellow-100 border-l-4 border-yellow-600 p-4 mb-4">
                <p className="text-sm font-medium text-gray-900">
                  <Clock className="inline-block w-4 h-4 mr-2" />
                  Väntar på verifiering
                </p>
                <p className="text-sm text-gray-800 mt-1">
                  Inskickad{" "}
                  {formatDistanceToNow(new Date(entrance.created_at || ""), {
                    addSuffix: true,
                    locale: sv,
                  })}
                </p>
                <p className="text-sm text-gray-800">
                  Granskning tar normalt 24-48 timmar
                </p>
              </div>
            )}
            <div className="space-y-4">
              {entrance.photos?.map((photo: EntrancePhoto) => (
                <div key={photo.photo_id} className="relative w-full">
                  <Button
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
                      src={getImageUrl(photo.photo_filename)}
                      alt={photo.description || ""}
                      width={600}
                      height={400}
                      className="rounded-md object-cover w-full h-auto opacity-50"
                    />
                  </Button>
                  {!isVerified && (
                    <div className="absolute bottom-4 right-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded-full opacity-90 border-2 border-dashed border-yellow-300">
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
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-6">{renderEntranceSection()}</div>
      </ScrollArea>
      <AddEntranceDialog
        place={place}
        isOpen={isAddEntranceDialogOpen}
        onClose={handleCloseAddEntranceDialog}
        onEntranceAdded={onEntranceAdded} // Pass the new prop
      />
      <PlacePhotoModal
        photos={allPlacePhotos.map((photo) => ({
          ...photo,
          photo_filename: getImageUrl(photo.photo_filename || ''),
          photo_id: Number(photo.photo_id),
          // Ensure all required properties are included
          created_at: "",
          entrance_id: null,
          place_id: null,
          updated_at: null,
          uploaded_by: null,
        }))}
        initialPhotoIndex={selectedPhotoIndex}
        onClose={handleClosePhotoDialog}
        isOpen={isPhotoDialogOpen}
      />
      <LoginPromptDialog
        appName="Entrén"
        onClose={handleCloseLoginPrompt}
        isOpen={isLoginPromptOpen}
      />
    </div>
  );
}
