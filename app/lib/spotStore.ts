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

type SpotStore = {
  spots: Spot[];
  isLoading: boolean;
  setSpots: (spots: Spot[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  fetchSpots: (params?: FetchParams) => Promise<void>;
  debouncedFetchSpots: (bounds: L.LatLngBounds | null) => void;
  selectedSpot: Spot | null;
  setSelectedSpot: (spot: Spot | null) => void;
  mapView: { center: [number, number]; zoom: number };
  setMapView: (view: { center: [number, number]; zoom: number }) => void;
};

export const useSpotsStore = create<SpotStore>((set, get) => ({
  spots: [],
  isLoading: false,
  setSpots: (spots) => set({ spots }),
  setIsLoading: (isLoading) => set({ isLoading }),
  fetchSpots: async (params) => {
    set({ isLoading: true });
    try {
      let filter = "";

      // Simulate a delay for testing purposes
      await new Promise((resolve) => setTimeout(resolve, 5000));

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

      set({ spots: result.items, isLoading: false });
    } catch (error) {
      console.error("Error fetching spots:", error);
      set({ isLoading: false });
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
