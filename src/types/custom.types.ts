import { Database } from "./database.types";

export type PlaceFromDB =
  Database["public"]["Views"]["detailed_places_view"]["Row"];
export type PlaceEntranceFromDB =
  Database["public"]["Views"]["detailed_entrances_view"]["Row"];
export type EntranceType =
  Database["public"]["Tables"]["entrance_types"]["Row"];

export type EntityChangeStaging =
  Database["public"]["Tables"]["entity_changes_staging"]["Row"];

type PlaceEntranceWithPendingBase =
  Database["public"]["Functions"]["get_place_entrances_with_pending"]["Returns"][0];

export type PlaceEntrancePhoto = {
  photo_id: string;
  photo_url: string;
  description: string | null;
};

export interface PlaceEntranceWithPending extends PlaceEntranceWithPendingBase {
  photos: PlaceEntrancePhoto[];
}

// Place
export interface Place extends PlaceFromDB {}
export interface PlaceEntrance extends PlaceEntranceFromDB {}
export type PlaceEntranceImage =
  Database["public"]["Tables"]["place_entrance_photos"]["Row"];
