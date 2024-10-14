import { Database } from "./database.types";

// Core types from the database
type EntranceTypeDB = Database["public"]["Tables"]["entrance_types"]["Row"];
type EntityChangeStagingDB =
  Database["public"]["Tables"]["entity_changes_staging"]["Row"];
type DetailedEntranceViewDB =
  Database["public"]["Views"]["detailed_entrances_view"]["Row"];
type DetailedPlaceViewDB =
  Database["public"]["Views"]["detailed_places_view"]["Row"];
type PlaceEntrancePhotoDB =
  Database["public"]["Tables"]["place_entrance_photos"]["Row"];

// Extended types
export type EntrancePhoto = {
  description: string | null;
  photo_id: string;
  photo_filename: string;
};

// Derived types for application use
export type EntranceType = EntranceTypeDB;
export type EntityChangeStaging = EntityChangeStagingDB;
export type Entrance = DetailedEntranceViewDB & {
  photos?: EntrancePhoto[];
};
export type Place = DetailedPlaceViewDB;
export type PlaceEntrance = DetailedEntranceViewDB;
export type PlaceEntranceImage = PlaceEntrancePhotoDB;

// Custom types for API schemas
export type EntranceEntitySchema = {
  entrance_type_id: number;
  location: {
    lat: number;
    long: number;
  };
  photo_filename: string;
  place_id: string;
};

export type PhotoEntitySchema = {
  description: string;
  photo_filename: string;
  place_id: string;
};

export type PlaceEntitySchema = {
  category_id: string;
  location: {
    lat: number;
    long: number;
  };
  name: string;
};

export interface Entrances extends Array<DetailedEntranceViewDB> {
  photos: EntrancePhoto[];
}
