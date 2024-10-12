import { registerMapEvents } from "@/src/libs/map/events";
import { addPlacesLayer, addPlacesOsmLayer } from "@/src/libs/map/layers";
import { addPlacesOsmSource, addPlacesSource } from "@/src/libs/map/sources";
import { Place, PlaceEntrance } from "@/src/types/custom.types";
import maplibregl from "maplibre-gl";
import { create } from "zustand";
import { addMapControls } from "./map/controls";

type StoreState = {
  // UI state
  view: "list" | "map" | "both";
  isFilterOpen: boolean;
  isMobile: boolean;
  setView: (view: "list" | "map" | "both") => void;
  setIsFilterOpen: (isOpen: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  toggleListVisibility: () => void;

  // Place-related state
  places: Place[];
  isLoading: boolean;
  selectedPlace: Place | null;
  visiblePlaces: Place[];
  setPlaces: (places: Place[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSelectedPlace: (place: Place | null) => void;
  setVisiblePlaces: (places: Place[]) => void;

  // Map-related state
  mapInstance: maplibregl.Map | null;
  mapView: { center: [number, number]; zoom: number };
  setMapInstance: (map: maplibregl.Map | null) => void;
  setMapView: (view: { center: [number, number]; zoom: number }) => void;
  fitBounds: (bounds: maplibregl.LngLatBounds) => void;
  onMapLoad: (map: maplibregl.Map) => void;

  // Entrances-related state
  selectedPlaceEntrances: PlaceEntrance[];
  isEntrancesLoading: boolean;
  setSelectedPlaceEntrances: (entrances: PlaceEntrance[]) => void;

  // User location state
  userLocation: { latitude: number; longitude: number } | null;
  setUserLocation: (
    location: { latitude: number; longitude: number } | null,
  ) => void;
};

export const useStore = create<StoreState>((set, get) => ({
  // UI state
  view: "map",
  isFilterOpen: false,
  isMobile: false,
  setView: (view) => set({ view }),
  setIsFilterOpen: (isOpen) => set({ isFilterOpen: isOpen }),
  setIsMobile: (isMobile) => set({ isMobile }),
  toggleListVisibility: () =>
    set((state) => {
      if (state.isMobile) {
        // On mobile, toggle between "list" and "map" views
        return { view: state.view === "list" ? "map" : "list" };
      } else {
        // On desktop, toggle between "both" and "map"
        return { view: state.view === "both" ? "map" : "both" };
      }
    }),

  // Place-related state
  places: [],
  isLoading: true,
  selectedPlace: null,
  visiblePlaces: [],
  setPlaces: (places) => set({ places }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSelectedPlace: (place) => set({ selectedPlace: place }),
  setVisiblePlaces: (places) => set({ visiblePlaces: places }),

  // Map-related state
  mapInstance: null,
  mapView: { center: [0, 0], zoom: 2 },
  setMapInstance: (map) => set({ mapInstance: map }),
  setMapView: (view) => set({ mapView: view }),
  fitBounds: (bounds) => {
    const { mapInstance } = get();
    if (mapInstance) {
      mapInstance.fitBounds(bounds, { padding: 50 });
    }
  },
  onMapLoad: (map) => {
    addPlacesSource(map);
    addPlacesOsmSource(map);
    addPlacesLayer(map);
    addPlacesOsmLayer(map);

    // Add map controls and events
    addMapControls(map);
    registerMapEvents(map);
  },

  // Entrances-related state
  selectedPlaceEntrances: [],
  isEntrancesLoading: false,
  setSelectedPlaceEntrances: (entrances) =>
    set({ selectedPlaceEntrances: entrances }),

  // User location state
  userLocation: null,
  setUserLocation: (location) => set({ userLocation: location }),
}));
