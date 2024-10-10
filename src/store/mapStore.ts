import { create } from "zustand";

interface Place {
  id: string;
  name: string;
  category: string;
  // Add any other properties you need
}

interface MapStore {
  visiblePlaces: Place[];
  setVisiblePlaces: (places: Place[]) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  visiblePlaces: [],
  setVisiblePlaces: (places) => set({ visiblePlaces: places }),
}));

export const setVisiblePlaces = (places: Place[]) => {
  useMapStore.getState().setVisiblePlaces(places);
};
