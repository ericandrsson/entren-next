// spotsStore.ts
import { create } from "zustand";
import debounce from "lodash/debounce";
import { pb } from "@/lib/db";
import { Spot } from "@/types";
import L from "leaflet";

interface FetchParams {
  bounds?: L.LatLngBounds;
  searchQuery?: string;
}

interface SpotsState {
  spots: Spot[];
  fetchSpots: (params?: FetchParams) => Promise<void>;
  debouncedFetchSpots: (bounds: L.LatLngBounds | null) => void;
}

export const useSpotsStore = create<SpotsState>((set, get) => ({
  spots: [],
  fetchSpots: async (params) => {
    try {
      let filter = "";
      console.log("Fetching spots with params:", params);

      // Construct filter based on bounds
      if (params?.bounds) {
        const ne = params.bounds.getNorthEast();
        const sw = params.bounds.getSouthWest();
        filter += `lat >= ${sw.lat} && lat <= ${ne.lat} && lng >= ${sw.lng} && lng <= ${ne.lng}`;
      }

      const result = await pb.collection("spots").getList<Spot>(1, 1000, {
        filter,
        sort: "-created",
        expand: "category",
      });

      console.log("Fetched spots:", result.items);
      set({ spots: result.items });
    } catch (error) {
      console.error("Error fetching spots:", error);
    }
  },
  debouncedFetchSpots: debounce((bounds: L.LatLngBounds | null) => {
    if (!bounds) return;
    get().fetchSpots({ bounds });
  }, 300),
}));
