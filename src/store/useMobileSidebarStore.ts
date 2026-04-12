import { create } from 'zustand';

interface MobilesidebarStore {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
}

export const useMobilesidebarStore = create<MobilesidebarStore>((set, get) => ({
  isOpen: false,
  toggle: () => {
    set({ isOpen: !get().isOpen });
  },
  close() {
    set({ isOpen: false });
  },
}));
