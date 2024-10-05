import { Database } from './database.types';

// Base type from the database view
export type SpotFromDB = Database['public']['Views']['detailed_spots_view']['Row'];

// Extended Spot type with additional frontend-specific properties
export interface Spot extends SpotFromDB {}
