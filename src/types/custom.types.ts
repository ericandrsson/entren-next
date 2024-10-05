import { Database } from './database.types';

// Base type from the database view
export type SpotFromDB = Database['public']['Views']['detailed_spots_view']['Row'];
export type SpotEntranceFromDB = Database['public']['Views']['detailed_spots_entrances']['Row'];
// Extended Spot type with additional frontend-specific properties
export interface Spot extends SpotFromDB {}
export interface SpotEntrance extends SpotEntranceFromDB {}
