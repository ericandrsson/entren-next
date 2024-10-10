// Start of Selection
import { registerMapEvents } from "@/src/libs/map/events";
import { addPlacesLayer } from "@/src/libs/map/layers";
import { addDetailedSpotsSource } from "@/src/libs/map/sources";
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
  setIsFilterOpen: (isOpen: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  setIsListCollapsed: (isCollapsed: boolean) => void;
  toggleListCollapse: () => void;

  // Spot-related state
  spots: Spot[];
  isLoading: boolean;
  selectedSpot: Spot | null;
  isSheetOpen: boolean;
  setSpots: (spots: Spot[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  fetchSpots: (params?: FetchParams) => Promise<Spot[]>;
  debouncedFetchSpots: (bounds: maplibregl.LngLatBounds | null) => void;
  setSelectedPlace: (spot: Spot | null) => void;
  openSpotSheet: (spot: Spot) => void;
  closeSpotSheet: () => void;

  // Map-related state
  mapInstance: maplibregl.Map | null;
  mapView: { center: [number, number]; zoom: number };
  setMapInstance: (map: maplibregl.Map | null) => void;
  setMapView: (view: { center: [number, number]; zoom: number }) => void;
  fitBounds: (bounds: maplibregl.LngLatBounds) => void;

  // Entrances-related state
  selectedSpotEntrances: SpotEntrance[];
  isEntrancesLoading: boolean;
  fetchSpotEntrances: (spotId: number) => Promise<void>;
  setSelectedSpotEntrances: (entrances: SpotEntrance[]) => void;

  // Visible spots
  visibleSpots: Spot[];
  setVisibleSpots: (spots: Spot[]) => void;

  // New method for loading map sources and layers
  onMapLoad: (map: maplibregl.Map) => void;
};

export const useStore = create<Store>((set, get) => ({
  // UI state
  view: "both",
  isStickyHeader: false,
  isFilterOpen: false,
  isMobile: false,
  isListCollapsed: true,
  setView: (view) => set({ view }),
  setIsStickyHeader: (sticky) => set({ isStickyHeader: sticky }),
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
      set({ visibleSpots: spots });
    },
    100,
  ),
  setSelectedPlace: (spot: Spot | null) => {
    set({ selectedSpot: spot });
    if (spot) {
      const { mapInstance } = get();
      if (mapInstance) {
        mapInstance.setLayoutProperty("detailed_spots_view", "icon-size", [
          "case",
          ["==", ["get", "spot_id"], spot.spot_id],
          1, // Size for the clicked spot
          0.65, // Default size for other spots
        ]);
        get().fetchSpotEntrances(spot.spot_id!);
      }
    } else {
      set({ selectedSpotEntrances: [] });
    }
  },
  openSpotSheet: (spot: Spot) => set({ selectedSpot: spot, isSheetOpen: true }),
  closeSpotSheet: () => set({ isSheetOpen: false }),

  // Map-related state
  mapInstance: null,
  mapView: { center: [0, 0], zoom: 2 },
  setMapInstance: (map: maplibregl.Map | null) => set({ mapInstance: map }),
  setMapView: (view) => set({ mapView: view }),
  fitBounds: (bounds: maplibregl.LngLatBounds) => {
    const { mapInstance } = get();
    if (mapInstance) {
      mapInstance.fitBounds(bounds, { padding: 50 });
    }
  },

  // Entrances-related state
  selectedSpotEntrances: [],
  isEntrancesLoading: false,
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

  // Visible spots
  visibleSpots: [],
  setVisibleSpots: (spots) => set({ visibleSpots: spots }),

  onMapLoad: (map) => {
    // Adds the sources and layers
    addDetailedSpotsSource(map);
    addPlacesLayer(map);
    //addLocalSwedenOsmPoiSource(map);
    //addLocalSwedenOsmPoiLayer(map);

    // Registers map events such as click events on spots
    registerMapEvents(map);
  },
}));
