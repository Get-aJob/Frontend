import { create } from 'zustand';

interface ToastState {
  visible: boolean;
  message: string;
  showToast: (message: string) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',
  showToast: (message: string) => {
    set({ visible: true, message });
    setTimeout(() => {
      set({ visible: false });
    }, 3000);
  },
  hideToast: () => set({ visible: false }),
}));
