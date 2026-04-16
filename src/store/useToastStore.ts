import { create } from 'zustand';

interface ToastState {
  visible: boolean;
  message: string;
  toastTimeoutId: number | null;
  showToast: (message: string) => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  visible: false,
  message: '',
  toastTimeoutId: null,
  showToast: (message: string) => {
    // 기존 타이머가 있으면 제거하여 레이스 컨디션 방지
    const currentTimeoutId = get().toastTimeoutId;
    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId);
    }

    set({ visible: true, message });

    const timeoutId = window.setTimeout(() => {
      set({ visible: false, toastTimeoutId: null });
    }, 3000);

    set({ toastTimeoutId: timeoutId as unknown as number });
  },
  hideToast: () => {
    const currentTimeoutId = get().toastTimeoutId;
    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId);
    }
    set({ visible: false, toastTimeoutId: null });
  },
}));
