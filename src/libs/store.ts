import { registerMapEvents } from "@/src/libs/map/events";
import { addPlacesLayer } from "@/src/libs/map/layers";
import { addDetailedSpotsSource } from "@/src/libs/map/sources";
import { Place, PlaceEntrance } from "@/src/types/custom.types";
import { createClient } from "@/utils/supabase/client";
import maplibregl from "maplibre-gl";
import { create } from "zustand";

interface FetchParams {
  bounds?: maplibregl.LngLatBounds;
  searchQuery?: string;
}

type Store = {
  // UI state
  view: "list" | "map";
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

  // Place-related state
  places: Place[];
  isLoading: boolean;
  selectedPlace: Place | null;
  isSheetOpen: boolean;
  setPlaces: (places: Place[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  fetchPlaces: (params?: FetchParams) => Promise<Place[]>;
  setSelectedPlace: (place: Place | null) => void;
  openPlaceSheet: (place: Place) => void;
  closePlaceSheet: () => void;

  // Map-related state
  mapInstance: maplibregl.Map | null;
  mapView: { center: [number, number]; zoom: number };
  setMapInstance: (map: maplibregl.Map | null) => void;
  setMapView: (view: { center: [number, number]; zoom: number }) => void;
  fitBounds: (bounds: maplibregl.LngLatBounds) => void;

  // Entrances-related state
  selectedPlaceEntrances: PlaceEntrance[];
  isEntrancesLoading: boolean;
  setSelectedPlaceEntrances: (entrances: PlaceEntrance[]) => void;

  // Visible places
  visiblePlaces: Place[];
  setVisiblePlaces: (places: Place[]) => void;

  // New method for loading map sources and layers
  onMapLoad: (map: maplibregl.Map) => void;
};

export const useStore = create<Store>((set, get) => ({
  // UI state
  view: "map", // Default to map view
  isStickyHeader: false,
  isFilterOpen: false,
  isMobile: false,
  isListCollapsed: false,
  setView: (view) => set({ view }),
  setIsStickyHeader: (sticky) => set({ isStickyHeader: sticky }),
  setIsFilterOpen: (isOpen) => set({ isFilterOpen: isOpen }),
  setIsMobile: (isMobile) => set({ isMobile }),
  setIsListCollapsed: (isCollapsed) => set({ isListCollapsed: isCollapsed }),
  toggleListCollapse: () =>
    set((state) => ({ isListCollapsed: !state.isListCollapsed })),

  // Place-related state
  places: [],
  isLoading: true,
  selectedPlace: null,
  isSheetOpen: false,
  setPlaces: (places) => set({ places }),
  setIsLoading: (isLoading) => set({ isLoading }),
  fetchPlaces: async (params?: FetchParams) => {
    set({ isLoading: true });
    try {
      if (params?.bounds) {
        const ne = params.bounds.getNorthEast();
        const sw = params.bounds.getSouthWest();
        const supabase = createClient();
        const { data, error } = await supabase.rpc(
          "get_places_in_bounding_box",
          {
            min_lat: sw.lat,
            min_long: sw.lng,
            max_lat: ne.lat,
            max_long: ne.lng,
          },
        );

        if (error) {
          console.error("Error fetching places:", error);
          return [];
        }
        const places = data as Place[];
        set({ places, isLoading: false });
        return places;
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    }
    set({ isLoading: false });
    return [];
  },

  setSelectedPlace: (place: Place | null) => {
    set({ selectedPlace: place });
    const { mapInstance } = get();
    if (place && mapInstance) {
      // Update icon size for the selected place
      mapInstance.setLayoutProperty("detailed_places_view", "icon-size", [
        "case",
        ["==", ["get", "id"], place.place_id],
        1, // Size for the selected place
        0.65, // Default size for other places
      ]);
    } else {
      // Reset entrances when no place is selected
      set({ selectedPlaceEntrances: [] });
    }
  },
  openPlaceSheet: (place: Place) =>
    set({ selectedPlace: place, isSheetOpen: true }),
  closePlaceSheet: () => set({ isSheetOpen: false }),

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
  selectedPlaceEntrances: [],
  isEntrancesLoading: false,
  setSelectedPlaceEntrances: (entrances: PlaceEntrance[]) =>
    set({ selectedPlaceEntrances: entrances }),

  // Visible places
  visiblePlaces: [],
  setVisiblePlaces: (places) => set({ visiblePlaces: places }),

  onMapLoad: (map: maplibregl.Map) => {
    // Adds the sources and layers
    addDetailedSpotsSource(map);
    addPlacesLayer(map);
    //addLocalSwedenOsmPoiSource(map);
    //addLocalSwedenOsmPoiLayer(map);

    // Registers map events such as click events on places
    registerMapEvents(map);
  },
}));
