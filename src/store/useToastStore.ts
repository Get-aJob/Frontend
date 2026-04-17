import { create } from 'zustand';

interface ToastState {
  visible: boolean;
  message: string;
  showLoginButton: boolean;
  showToast: (message: string, showLoginButton?: boolean) => void;
  hideToast: () => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  message: '',
  showLoginButton: false,
  showToast: (message, showLoginButton = false) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ visible: true, message, showLoginButton });
    toastTimer = setTimeout(() => {
      set({ visible: false, showLoginButton: false });
    }, 3000);
  },
  hideToast: () => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ visible: false, showLoginButton: false });
  },
}));
