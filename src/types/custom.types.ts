import { Database } from "./database.types";

export type EntranceEntitySchema = {
  entrance_type_id: number;
  location: {
    lat: number;
    long: number;
  };
  photo_url: string;
  place_id: string;
};

export type EntrancePhoto = {
  description: string | null;
  photo_id: string;
  photo_url: string;
};

export type EntranceType =
  Database["public"]["Tables"]["entrance_types"]["Row"];

export type EntityChangeStaging =
  Database["public"]["Tables"]["entity_changes_staging"]["Row"];

type EntrancesBase =
  Database["public"]["Views"]["detailed_entrances_view"]["Row"][];

export interface Entrances extends EntrancesBase {
  photos: EntrancePhoto[];
}

export type PhotoEntitySchema = {
  description: string;
  photo_url: string;
  place_id: string;
};

export interface Place extends PlaceFromDB {}

export interface PlaceEntrance extends PlaceEntranceFromDB {}

export type PlaceEntranceFromDB =
  Database["public"]["Views"]["detailed_entrances_view"]["Row"];

export type PlaceEntranceImage =
  Database["public"]["Tables"]["place_entrance_photos"]["Row"];

export type PlaceEntitySchema = {
  category_id: string;
  location: {
    lat: number;
    long: number;
  };
  name: string;
};

export type PlaceFromDB =
  Database["public"]["Views"]["detailed_places_view"]["Row"];
