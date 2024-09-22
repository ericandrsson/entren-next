import { create } from "zustand";
import L from "leaflet";
import debounce from "lodash/debounce";
import { pb } from "@/lib/db";
import { Spot } from "@/types";

interface MapState {
  mapCenter: L.LatLngExpression;
  zoom: number;
  currentMode: "view";
  spots: Spot[];
  debouncedFetchSpots: (bounds: L.LatLngBounds) => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  mapCenter: [62.0, 15.0],
  zoom: 5,
  currentMode: "view",
  spots: [],

  debouncedFetchSpots: debounce(async (bounds: L.LatLngBounds) => {
    if (!bounds) return; // Exit if bounds are invalid

    console.log(
      "Fetching spots with bounds:",
      bounds.getNorthEast(),
      bounds.getSouthWest()
    );

    try {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      let filter = `lat >= ${sw.lat} && lat <= ${ne.lat} && lng >= ${sw.lng} && lng <= ${ne.lng}`;
      const result = await pb.collection("spots").getList<Spot>(1, 1000, {
        filter: filter,
        sort: "-created",
        expand: "category",
      });

      console.log("Fetched spots:", result.items);

      set({ spots: result.items });
    } catch (error) {
      console.error("Error fetching spots:", error);
    }
  }, 300),
}));

// Add this new function to fetch spots
export async function fetchSpots() {
  // Implement your spot fetching logic here
  // For example:
  const response = await fetch("/api/spots");
  const spots = await response.json();
  return spots;
}
