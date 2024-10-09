import { Spot, SpotEntrance } from "@/src/types/custom.types";
import { createClient } from "@/utils/supabase/client";
import debounce from "lodash/debounce";
import maplibregl from "maplibre-gl";
import { create } from "zustand";

interface FetchParams {
  bounds?: maplibregl.LngLatBounds;
  searchQuery?: string;
}

type Store = {
  // UI state
  view: "list" | "map" | "both";
  isStickyHeader: boolean;
  isFilterOpen: boolean;
  isMobile: boolean;
  isListCollapsed: boolean;
  setView: (view: "list" | "map" | "both") => void;
  setIsStickyHeader: (sticky: boolean) => void;
  setVisibleSpots: (spots: Spot[]) => void; // Add this line
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
  mapInstance: maplibregl.Map | null;
  mapView: { center: [number, number]; zoom: number };

  // Spot actions
  setSpots: (spots: Spot[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  fetchSpots: (params?: FetchParams) => Promise<Spot[]>;
  debouncedFetchSpots: (bounds: maplibregl.LngLatBounds | null) => void;
  setSelectedSpot: (spot: Spot | null) => void;
  openSpotSheet: (spot: Spot) => void;
  closeSpotSheet: () => void;

  // Map actions
  setMapInstance: (map: maplibregl.Map | null) => void;
  setMapView: (view: { center: [number, number]; zoom: number }) => void;
  fitBounds: (bounds: maplibregl.LngLatBounds) => void;

  // New properties for entrances
  selectedSpotEntrances: SpotEntrance[];
  isEntrancesLoading: boolean;

  // New actions for entrances
  fetchSpotEntrances: (spotId: number) => Promise<void>;
  setSelectedSpotEntrances: (entrances: SpotEntrance[]) => void;

  // New state for visible spots
  visibleSpots: Spot[];

  // New action for setting visible spots
};

export const useStore = create<Store>((set, get) => ({
  // UI state
  view: "both",
  isFilterOpen: false,
  isStickyHeader: false,
  isMobile: false,
  isListCollapsed: false,
  visibleSpots: [], // Add this line
  setView: (view) => set({ view }),
  setIsStickyHeader: (sticky) => set({ isStickyHeader: sticky }),
  setVisibleSpots: (spots) => set({ visibleSpots: spots }), // Add this line
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
      if (params?.bounds) {
        const ne = params.bounds.getNorthEast();
        const sw = params.bounds.getSouthWest();
        const supabase = createClient();
        const { data, error } = await supabase.rpc(
          "get_spots_in_bounding_box",
          {
            min_lat: sw.lat,
            min_long: sw.lng,
            max_lat: ne.lat,
            max_long: ne.lng,
          },
        );

        if (error) {
          console.error("Error fetching spots:", error);
          return [];
        }
        const spots = data as Spot[];
        set({ spots, isLoading: false });
        return spots;
      }
    } catch (error) {
      console.error("Error fetching spots:", error);
    }
    set({ isLoading: false });
    return [];
  },
  debouncedFetchSpots: debounce(
    async (bounds: maplibregl.LngLatBounds | null) => {
      if (!bounds) return;
      const spots = await get().fetchSpots({ bounds });
      set({ visibleSpots: spots }); // Use set directly instead of get().setVisibleSpots
    },
    100,
  ),
  setSelectedSpot: (spot: Spot | null) => {
    set({ selectedSpot: spot });
    if (spot) {
      const { mapInstance } = get();
      if (mapInstance) {
        mapInstance.flyTo({
          center: [spot.long!, spot.lat!],
          zoom: 16,
          essential: true,
        });
      }
      get().fetchSpotEntrances(spot.spot_id!);
    } else {
      set({ selectedSpotEntrances: [] });
    }
  },
  openSpotSheet: (spot: Spot) => set({ selectedSpot: spot, isSheetOpen: true }),
  closeSpotSheet: () => set({ isSheetOpen: false }),

  // Map actions
  setMapInstance: (map: maplibregl.Map | null) => set({ mapInstance: map }),
  setMapView: (view) => set({ mapView: view }),
  fitBounds: (bounds: maplibregl.LngLatBounds) => {
    const { mapInstance } = get();
    if (mapInstance) {
      mapInstance.fitBounds(bounds, { padding: 50 });
    }
  },

  // New state for entrances
  selectedSpotEntrances: [],
  isEntrancesLoading: false,

  // New actions for entrances
  fetchSpotEntrances: async (spotId: number) => {
    const supabase = createClient();
    set({ isEntrancesLoading: true });
    try {
      const { data, error } = await supabase
        .from("detailed_spots_entrances")
        .select("*")
        .eq("spot_id", spotId);

      if (error) {
        console.error("Error fetching spot entrances:", error);
        return;
      }
      set({
        selectedSpotEntrances: data as SpotEntrance[],
        isEntrancesLoading: false,
      });
    } catch (error) {
      console.error("Error fetching spot entrances:", error);
      set({ isEntrancesLoading: false });
    }
  },
  setSelectedSpotEntrances: (entrances: SpotEntrance[]) =>
    set({ selectedSpotEntrances: entrances }),
}));
