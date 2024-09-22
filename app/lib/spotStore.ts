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

interface SpotStore {
  selectedSpot: Spot | null;
  setSelectedSpot: (spot: Spot | null) => void;
  mapView: { center: [number, number]; zoom: number };
  setMapView: (view: { center: [number, number]; zoom: number }) => void;
}

export const useSpotsStore = create<SpotsState & SpotStore>((set, get) => ({
  spots: [],
  fetchSpots: async (params) => {
    try {
      let filter = "";

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

      set({ spots: result.items });
    } catch (error) {
      console.error("Error fetching spots:", error);
    }
  },
  debouncedFetchSpots: debounce((bounds: L.LatLngBounds | null) => {
    if (!bounds) return;
    get().fetchSpots({ bounds });
  }, 500),
  selectedSpot: null,
  setSelectedSpot: (spot) => set({ selectedSpot: spot }),
  mapView: { center: [0, 0], zoom: 2 },
  setMapView: (view) => set({ mapView: view }),
}));
