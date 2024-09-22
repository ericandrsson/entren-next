import { create } from 'zustand';

interface MapState {
  view: 'list' | 'map' | 'both';
  isFilterOpen: boolean;
  isMobile: boolean;
  isListCollapsed: boolean;
  setView: (view: 'list' | 'map' | 'both') => void;
  setIsFilterOpen: (isOpen: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  setIsListCollapsed: (isCollapsed: boolean) => void;
  toggleListCollapse: () => void;
}

export const useMapStore = create<MapState>((set) => ({
  view: 'both',
  isFilterOpen: false,
  isMobile: false,
  isListCollapsed: false,
  setView: (view) => set({ view }),
  setIsFilterOpen: (isOpen) => set({ isFilterOpen: isOpen }),
  setIsMobile: (isMobile) => set({ isMobile, view: isMobile ? 'list' : 'both' }),
  setIsListCollapsed: (isCollapsed) => set({ isListCollapsed: isCollapsed }),
  toggleListCollapse: () => set((state) => ({ isListCollapsed: !state.isListCollapsed })),
}));