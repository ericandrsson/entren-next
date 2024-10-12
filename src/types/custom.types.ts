import { Database } from "./database.types";

export type PlaceFromDB =
  Database["public"]["Views"]["detailed_places_view"]["Row"];
export type PlaceEntranceFromDB =
  Database["public"]["Views"]["detailed_entrances_view"]["Row"];

// Place
export interface Place extends PlaceFromDB {
  photos: string[];
}
export interface PlaceEntrance extends PlaceEntranceFromDB {}
export type PlaceEntranceImage =
  Database["public"]["Tables"]["place_entrance_images"]["Row"];

export interface PlaceEntranceWithImages extends PlaceEntrance {
  photos: PlaceEntranceImage[];
}

// Place OSM
export type PlaceOsm =
  Database["public"]["Views"]["detailed_places_osm_view"]["Row"];
