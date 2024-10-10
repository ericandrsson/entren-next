import { Database } from "./database.types";

export type PlaceFromDB =
  Database["public"]["Views"]["detailed_places_view"]["Row"];
export type PlaceEntranceFromDB =
  Database["public"]["Views"]["detailed_entrances_view"]["Row"];
export interface Place extends PlaceFromDB {}
export interface PlaceEntrance extends PlaceEntranceFromDB {}
export type PlaceEntranceImage =
  Database["public"]["Tables"]["place_entrance_images"]["Row"];

export interface PlaceEntranceWithImages extends PlaceEntrance {
  photos: PlaceEntranceImage[];
}
