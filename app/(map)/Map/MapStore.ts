import { create } from "zustand";
import { SearchResult, Spot, UnverifiedNode } from "@/types";
import L from "leaflet";

interface MapState {
  tempSpot: Spot | null;
  setTempSpot: (spot: Spot | null) => void;
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
  handleSelectPlace: (result: SearchResult) => Promise<void>;
  handleSpotClick: (spot: Spot) => void;
  handleUnverifiedNodeClick: (node: UnverifiedNode) => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  tempSpot: null,
  setTempSpot: (spot) => set({ tempSpot: spot }),
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
  handleSelectPlace: async (result) => {
    // Implement the logic for handleSelectPlace here
    // You can access other state values and setters using get()
    // For example: const { setMapCenter, setZoom } = get();
  },
  handleSpotClick: (spot) => {
    const { setSelectedSpot, setMapCenter, setZoom } = get();
    setSelectedSpot(spot);
    setMapCenter([spot.lat, spot.lng]);
    setZoom(18);
  },
  handleUnverifiedNodeClick: (node) => {
    // Implement the logic for handleUnverifiedNodeClick here
  },
}));
