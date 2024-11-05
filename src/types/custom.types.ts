import { JwtPayload } from "jwt-decode";
import { Database } from "./database.types";

// Core types from the database
type EntranceTypeDB = Database["public"]["Tables"]["entrance_types"]["Row"];
type EntityChangeStagingDB = Database["public"]["Tables"]["entity_changes_staging"]["Row"];
type DetailedEntranceViewDB = Database["public"]["Views"]["entrances_view"]["Row"];
type DetailedPlaceViewDB = Database["public"]["Views"]["places_view"]["Row"];
type PlaceEntrancePhotoDB = Database["public"]["Tables"]["entrance_photos"]["Row"];
type EntityChangesEventsDB = Database["public"]["Views"]["entity_changes_events_view"]["Row"];
type UserDB = Database["public"]["Tables"]["users"]["Row"];




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
export type PlaceEntitySchema = {
  name: string;
  location: {
    coordinates: {
      lat: number;
      long: number;
    };
  };
  category_id: number;
  source: string;
  external_id?: string;
  submitted_by: string; // UUID
  is_active?: boolean;
  overridden_fields?: Record<string, any>;
};

export type EntranceEntitySchema = {
  place_id: number;
  entrance_type_id: number;
  photo_filename?: string;
  location: {
    coordinates: {
      lat: number;
      long: number;
    };
  };
  accessibility_info?: Record<string, any>;
  source: string;
  submitted_by: string; // UUID
};

export type PhotoEntitySchema = {
  photo_filename: string;
  description?: string;
  place_id: number;
  submitted_by: string; // UUID
  source: string;
};

export interface Entrances extends Array<DetailedEntranceViewDB> {
  photos: EntrancePhoto[];
}

export interface CustomJwtPayload extends JwtPayload {
  user_role?: string;
}

export interface EntityChangeEvent extends EntityChangesEventsDB {
  change_data: PlaceEntitySchema | EntranceEntitySchema;
}

export type AppRole = Database["public"]["Enums"]["app_role"];
export type User = UserDB;