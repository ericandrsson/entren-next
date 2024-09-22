import { create } from "zustand";
import L from "leaflet";
import debounce from "lodash/debounce";
import { pb } from "@/lib/db";
import { Spot } from "@/types";

// Remove UnverifiedNode if it's not used or defined in @/types
interface MapState {
  spots: Spot[];
  setSpots: (spots: Spot[]) => void;
  fetchSpots: (bounds: L.LatLngBounds) => Promise<void>;
  debouncedFetchSpots: (bounds: L.LatLngBounds) => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  mapCenter: [62.0, 15.0],
  zoom: 5,
  currentMode: "view",
  spots: [],
  setSpots: (spots) => set({ spots }),
  fetchSpots: async (bounds: L.LatLngBounds) => {
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
  },
  debouncedFetchSpots: debounce(async (bounds: L.LatLngBounds) => {
    const { fetchSpots } = get();
    await fetchSpots(bounds);
  }, 300),
}));
