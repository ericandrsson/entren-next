import { Card, CardContent, CardFooter } from "@/src/components/ui/card";
import { logger } from "@/src/libs/logger";
import { useStore } from "@/src/libs/store";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Place } from "../../types/custom.types";
import PlaceInfoContent from "./PlaceInfoContent";
import PlaceInfoFooter from "./PlaceInfoFooter";
import PlaceInfoHeader from "./PlaceInfoHeader";

const log = logger.child({ module: "PlaceInfoCard" });

export default function PlaceInfoCard({ place }: { place: Place }) {
  const [entranceCount, setEntranceCount] = useState(0);
  const {
    setIsAddEntranceDialogOpen,
    setIsLoginPromptOpen,
    isUserAuthenticated,
    setIsUserAuthenticated,
  } = useStore();

  const supabase = createClient();

  useEffect(() => {
    const checkUserAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsUserAuthenticated(!!user);
      log.info("user authentication checked", { isAuthenticated: !!user });
    };

    checkUserAuth();
  }, [setIsUserAuthenticated]);

  const handleAddEntrance = () => {
    if (isUserAuthenticated) {
      setIsAddEntranceDialogOpen(true);
      log.info("add entrance dialog opened", { isAuthenticated: true });
    } else {
      setIsLoginPromptOpen(true);
      log.info("login prompt opened for add entrance", {
        isAuthenticated: false,
      });
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-250px)]">
      <PlaceInfoHeader place={place} />
      <CardContent className="flex-grow overflow-hidden p-0">
        <PlaceInfoContent
          place={place}
          onEntranceCountChange={(count) => setEntranceCount(count)}
        />
      </CardContent>
      <CardFooter>
        <PlaceInfoFooter
          place={place}
          entranceCount={entranceCount}
          onAddEntrance={handleAddEntrance}
        />
      </CardFooter>
    </Card>
  );
}
