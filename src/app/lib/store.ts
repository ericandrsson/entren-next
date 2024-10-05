import { create } from "zustand";
import debounce from "lodash/debounce";
import L from "leaflet";
import { supabase } from "@/src/lib/supabase";
import { Spot } from "@/src/types/custom.types";
interface FetchParams {
  bounds?: L.LatLngBounds;
  searchQuery?: string;
}

type Store = {
  // UI state
  view: "list" | "map" | "both";
  isFilterOpen: boolean;
  isMobile: boolean;
  isListCollapsed: boolean;
  setView: (view: "list" | "map" | "both") => void;
  setIsFilterOpen: (isOpen: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  setIsListCollapsed: (isCollapsed: boolean) => void;
  toggleListCollapse: () => void;

  // Spot-related state
  spots: Spot[];
  isLoading: boolean;
  selectedSpot: Spot | null;
  isSheetOpen: boolean;

  // Map-related state
  mapInstance: L.Map | null;
  mapView: { center: [number, number]; zoom: number };

  // Spot actions
  setSpots: (spots: Spot[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  fetchSpots: (params?: FetchParams) => Promise<void>;
  debouncedFetchSpots: (bounds: L.LatLngBounds | null) => void;
  setSelectedSpot: (spot: Spot | null) => void;
  openSpotSheet: (spot: Spot) => void;
  closeSpotSheet: () => void;

  // Map actions
  setMapInstance: (map: L.Map | null) => void;
  setMapView: (view: { center: [number, number]; zoom: number }) => void;
  fitBounds: (bounds: L.LatLngBounds) => void;
};

export const useStore = create<Store>((set, get) => ({
  // UI state
  view: "both",
  isFilterOpen: false,
  isMobile: false,
  isListCollapsed: false,
  setView: (view) => set({ view }),
  setIsFilterOpen: (isOpen) => set({ isFilterOpen: isOpen }),
  setIsMobile: (isMobile) =>
    set({ isMobile, view: isMobile ? "list" : "both" }),
  setIsListCollapsed: (isCollapsed) => set({ isListCollapsed: isCollapsed }),
  toggleListCollapse: () =>
    set((state) => ({ isListCollapsed: !state.isListCollapsed })),

  // Spot-related state
  spots: [],
  isLoading: true,
  selectedSpot: null,
  isSheetOpen: false,

  // Map-related state
  mapInstance: null,
  mapView: { center: [0, 0], zoom: 2 },

  // Spot actions
  setSpots: (spots) => set({ spots }),
  setIsLoading: (isLoading) => set({ isLoading }),
  fetchSpots: async (params) => {
    set({ isLoading: true });
    try {
      let filter = "";

      if (params?.bounds) {
        const ne = params.bounds.getNorthEast();
        const sw = params.bounds.getSouthWest();
        filter += `lat >= ${sw.lat} && lat <= ${ne.lat} && lng >= ${sw.lng} && lng <= ${ne.lng}`;
      }

      const { data, error } = await supabase.rpc("get_spots_in_bounding_box", {
        min_lat: params?.bounds?.getSouthWest().lat!,
        min_long: params?.bounds?.getSouthWest().lng!,
        max_lat: params?.bounds?.getNorthEast().lat!,
        max_long: params?.bounds?.getNorthEast().lng!,
      });

      if (error) {
        console.error("Error fetching spots:", error);
        return;
      }
      set({ spots: data as Spot[], isLoading: false });
    } catch (error) {
      console.error("Error fetching spots:", error);
      set({ isLoading: false });
    }
  },
  debouncedFetchSpots: debounce((bounds: L.LatLngBounds | null) => {
    if (!bounds) return;
    get().fetchSpots({ bounds });
  }, 100),
  setSelectedSpot: (spot: Spot | null) => {
    set({ selectedSpot: spot });
    if (spot) {
      set({ mapView: { center: [spot.lat!, spot.long!], zoom: 16 } });
      setTimeout(() => {
        set({ isSheetOpen: true });
      }, 500);
    }
  },
  openSpotSheet: (spot: Spot) => set({ selectedSpot: spot, isSheetOpen: true }),
  closeSpotSheet: () => set({ isSheetOpen: false }),

  // Map actions
  setMapInstance: (map: L.Map | null) => set({ mapInstance: map }),
  setMapView: (view) => set({ mapView: view }),
  fitBounds: (bounds: L.LatLngBounds) => {
    const { mapInstance } = get();
    if (mapInstance) {
      mapInstance.fitBounds(bounds);
    }
  },
}));
