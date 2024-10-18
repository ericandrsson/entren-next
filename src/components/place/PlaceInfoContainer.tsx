import { logger } from "@/src/libs/logger";
import { useStore } from "@/src/libs/store";
import { Entrance, EntrancePhoto, Place } from "@/src/types/custom.types";
import { createClient } from "@/utils/supabase/client";
import { useCallback, useEffect, useState } from "react";
import PlaceInfoCard from "./PlaceInfoCard";
import PlaceInfoDrawer from "./PlaceInfoDrawer";

const log = logger.child({ module: "PlaceInfoContainer" });

export default function PlaceInfoContainer({ place }: { place: Place | null }) {
  const {
    isMobile,
    setSelectedPlace,
    isUserAuthenticated,
    setIsAddEntranceDialogOpen,
    setIsLoginPromptOpen,
  } = useStore();
  const [entrances, setEntrances] = useState<Entrance[]>([]);
  const [allPlacePhotos, setAllPlacePhotos] = useState<EntrancePhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

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
    const fetchEntrances = async () => {
      if (!place) return;

      setIsLoading(true);
      log.info("fetching entrances", { placeId: place.place_id });
      const { data, error } = await supabase
        .from("entrances_view")
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

      const entrancesData = data as Entrance[];
      const filteredEntrances = entrancesData.filter(
        (entrance) =>
          entrance.status !== "pending" || entrance.created_by === user?.id,
      );

      setEntrances(filteredEntrances);
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
  }, [place, supabase, user]);

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
  }, [isUserAuthenticated, setIsAddEntranceDialogOpen, setIsLoginPromptOpen]);

  if (!place) return null;

  const sharedProps = {
    place,
    entrances,
    allPlacePhotos,
    isLoading,
    onAddEntrance: handleAddEntrance,
  };

  if (isMobile) {
    return (
      <PlaceInfoDrawer
        {...sharedProps}
        isOpen={!!place}
        onClose={() => setSelectedPlace(null)}
      />
    );
  }

  return (
    <div className="absolute bottom-8 left-8 z-10 w-full max-w-sm">
      <PlaceInfoCard {...sharedProps} />
    </div>
  );
}
