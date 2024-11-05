import { useAuth } from "@/src/context/auth-provider";
import { logger } from "@/src/libs/logger";
import { useStore } from "@/src/libs/store";
import { Entrance, EntrancePhoto, Place } from "@/src/types/custom.types";
import { createClient } from "@/utils/supabase/client";
import { useCallback, useEffect, useState } from "react";
import AddEntranceDialog from "../entrance/add-entrance-dialog";
import PlaceInfoCard from "./PlaceInfoCard";
import PlaceInfoDrawer from "./PlaceInfoDrawer";

const log = logger.child({ module: "PlaceInfoContainer" });

export default function PlaceInfoContainer({ place }: { place: Place | null }) {
  const { isMobile, setSelectedPlace, isAddEntranceDialogOpen, setIsAddEntranceDialogOpen, setIsLoginPromptOpen } =
    useStore();
  const [entrances, setEntrances] = useState<Entrance[]>([]);
  const [allPlacePhotos, setAllPlacePhotos] = useState<EntrancePhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const supabase = createClient();

  const fetchEntrances = useCallback(async () => {
    if (!place) return;

    setIsLoading(true);
    log.info("fetching entrances", { placeId: place.place_id });
    const { data, error } = await supabase.from("entrances_view").select("*").eq("place_id", place.place_id);

    if (error) {
      log.error("error fetching entrances", {
        error: error.message,
        placeId: place.place_id,
      });
      setIsLoading(false);
      return;
    }

    const entrancesData = data as Entrance[];
    const filteredEntrances = entrancesData.filter(
      (entrance) => entrance.status !== "pending" || entrance.created_by === user?.id,
    );

    setEntrances(filteredEntrances);
    setAllPlacePhotos(filteredEntrances.flatMap((e) => e.photos as EntrancePhoto[]));
    log.info("entrances fetched and filtered successfully", {
      placeId: place.place_id,
      entranceCount: filteredEntrances.length,
      photoCount: filteredEntrances.flatMap((e) => e.photos as EntrancePhoto[]).length,
    });
    setIsLoading(false);
  }, [place, supabase, user]);

  useEffect(() => {
    fetchEntrances();
  }, [fetchEntrances]);

  const handleAddEntrance = useCallback(() => {
    if (user) {
      setIsAddEntranceDialogOpen(true);
      log.info("add entrance dialog opened", { isAuthenticated: true });
    } else {
      setIsLoginPromptOpen(true);
      log.info("login prompt opened for add entrance", {
        isAuthenticated: false,
      });
    }
  }, [user, setIsAddEntranceDialogOpen, setIsLoginPromptOpen]);

  const handleEntranceAdded = useCallback(() => {
    log.info("Entrance added, refreshing entrances");
    fetchEntrances();
  }, [fetchEntrances]);

  const handleCloseAddEntranceDialog = useCallback(() => {
    setIsAddEntranceDialogOpen(false);
    log.debug("add entrance dialog closed");
  }, [setIsAddEntranceDialogOpen]);

  if (!place) return null;

  const sharedProps = {
    place,
    entrances,
    allPlacePhotos,
    isLoading,
    onAddEntrance: handleAddEntrance,
    onEntranceAdded: handleEntranceAdded,
  };

  return (
    <>
      {isMobile ? (
        <PlaceInfoDrawer {...sharedProps} isOpen={!!place} onClose={() => setSelectedPlace(null)} />
      ) : (
        <div className="absolute bottom-8 left-8 z-10 w-full max-w-sm">
          <PlaceInfoCard {...sharedProps} />
        </div>
      )}
      <AddEntranceDialog
        place={place}
        isOpen={isAddEntranceDialogOpen}
        onClose={handleCloseAddEntranceDialog}
        onEntranceAdded={handleEntranceAdded}
      />
    </>
  );
}
