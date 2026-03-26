import { create } from 'zustand';

interface MenuState {
  isAnyMenuOpen: boolean;
  setIsAnyMenuOpen: (open: boolean) => void;
}

export const useResumeItemMenuStore = create<MenuState>((set) => ({
  isAnyMenuOpen: false,
  setIsAnyMenuOpen: (open) => set({ isAnyMenuOpen: open }),
}));
