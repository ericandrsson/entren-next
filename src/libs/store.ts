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

type StoreState = {
  // UI state
  view: "list" | "map" | "both";
  isFilterOpen: boolean;
  isMobile: boolean;
  isListVisible: boolean;
  setView: (view: "list" | "map" | "both") => void;
  setIsFilterOpen: (isOpen: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  setisListVisible: (isCollapsed: boolean) => void;
  toggleListCollapse: () => void;

  // Place-related state
  places: Place[];
  isLoading: boolean;
  selectedPlace: Place | null;
  setPlaces: (places: Place[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  fetchPlaces: (params?: FetchParams) => Promise<Place[]>;
  setSelectedPlace: (place: Place | null) => void;

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
  setVisiblePlaces: (places: any[]) => void; // Update the type according to your place object structure

  // New method for loading map sources and layers
  onMapLoad: (map: maplibregl.Map) => void;

  // Detail state
  isDetailOpen: boolean;
  closeDetail: () => void;

  // User location state
  userLocation: { latitude: number; longitude: number } | null;
  setUserLocation: (
    location: { latitude: number; longitude: number } | null,
  ) => void;
};

export const useStore = create<StoreState>((set, get) => ({
  // UI state
  view: "map", // Default to map view
  isFilterOpen: false,
  isMobile: false,
  isListVisible: false,
  isDetailOpen: false,
  setView: (view) => set({ view }),
  setIsFilterOpen: (isOpen) => set({ isFilterOpen: isOpen }),
  setIsMobile: (isMobile) => set({ isMobile }),
  setisListVisible: (isCollapsed) => set({ isListVisible: isCollapsed }),
  toggleListCollapse: () =>
    set((state) => ({ isListVisible: !state.isListVisible })),

  // Place-related state
  places: [],
  isLoading: true,
  selectedPlace: null,
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
    const isMobile = get().isMobile;
    set({
      selectedPlace: place,
      isDetailOpen: place !== null,
      view: isMobile && place ? "list" : get().view,
    });
  },

  closeDetail: () => {
    set({ selectedPlace: null, isDetailOpen: false });
  },

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

  // User location state
  userLocation: null,
  setUserLocation: (location) => set({ userLocation: location }),
}));
