import { create } from "zustand";
import { SearchResult, Spot } from "@/types";
import L from "leaflet";
import debounce from 'lodash/debounce';
import { pb } from "@/lib/db";

// Remove UnverifiedNode if it's not used or defined in @/types
interface MapState {
  previewedSpot: Spot | null;
  setPreviewedSpot: (spot: Spot | null) => void;
  refreshKey: number;
  refreshSpots: () => void;
  isDetailed: boolean;
  setIsDetailed: (isDetailed: boolean) => void;
  mapCenter: [number, number];
  setMapCenter: (center: [number, number]) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  selectedSpot: Spot | null;
  setSelectedSpot: (spot: Spot | null) => void;
  currentMode: "view" | "contribute";
  setCurrentMode: (mode: "view" | "contribute") => void;
  handleMapClick: (e: L.LeafletMouseEvent) => void;
  handleSelectSpot: (result: SearchResult) => Promise<void>;
  handleSpotClick: (spot: Spot) => void;
  // Remove handleUnverifiedNodeClick if UnverifiedNode is not used
  spots: Spot[];
  setSpots: (spots: Spot[]) => void;
  fetchSpots: (bounds: L.LatLngBounds) => Promise<void>;
  isMapVisible: boolean;
  setIsMapVisible: (isVisible: boolean) => void;
  search: string;
  setSearch: (search: string) => void;
  debouncedFetchSpots: (bounds: L.LatLngBounds) => void;
  searchSpots: (query: string) => Promise<void>;
}

export const useMapStore = create<MapState>((set, get) => ({
  previewedSpot: null,
  setPreviewedSpot: (spot) => set({ previewedSpot: spot }),
  refreshKey: 0,
  refreshSpots: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
  isDetailed: false,
  setIsDetailed: (isDetailed) => set({ isDetailed }),
  mapCenter: [62.0, 15.0],
  setMapCenter: (center) => set({ mapCenter: center }),
  zoom: 5,
  setZoom: (zoom) => set({ zoom }),
  selectedSpot: null,
  setSelectedSpot: (spot) => set({ selectedSpot: spot }),
  currentMode: "view",
  setCurrentMode: (mode) => set({ currentMode: mode }),
  spots: [],
  setSpots: (spots) => set({ spots }),
  handleMapClick: (e) => {
    // Implement map click logic
    const { setMapCenter, setZoom } = get();
    setMapCenter([e.latlng.lat, e.latlng.lng]);
    setZoom(get().zoom + 1);
  },
  handleSelectSpot: async (result) => {
    const { setSelectedSpot, setMapCenter, setZoom } = get();
    // Implement select spot logic
    if (result.type === 'spot') {
      setSelectedSpot(result.item);
      setMapCenter([result.item.lat, result.item.lng]);
      setZoom(18);
    }
  },
  handleSpotClick: (spot) => {
    const { setSelectedSpot, setMapCenter, setZoom } = get();
    setSelectedSpot(spot);
    setMapCenter([spot.lat, spot.lng]);
    setZoom(18);
  },
  fetchSpots: async (bounds: L.LatLngBounds) => {
    try {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();

      let filter = `lat >= ${sw.lat} && lat <= ${ne.lat} && lng >= ${sw.lng} && lng <= ${ne.lng}`;

      const currentZoom = get().zoom;
      const limit = currentZoom < 5 ? 100 : 1000;

      const result = await pb.collection("spots").getList<Spot>(1, limit, {
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
  isMapVisible: true,
  setIsMapVisible: (isVisible) => set({ isMapVisible: isVisible }),
  search: '',
  setSearch: (search) => set({ search }),
  debouncedFetchSpots: debounce(async (bounds: L.LatLngBounds) => {
    const { fetchSpots } = get();
    await fetchSpots(bounds);
  }, 300),
  searchSpots: async (query: string) => {
    // Implement search logic here
    const response = await fetch(`/api/spots/search?q=${query}`);
    const spots = await response.json();
    set({ spots, search: query });
  },
}));
