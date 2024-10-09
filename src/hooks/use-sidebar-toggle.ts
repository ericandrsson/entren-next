import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  setIsOpen: () => void;
}

export const useSidebarToggle = create<SidebarState>((set) => ({
  isOpen: false, // Changed from true to false
  setIsOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));
