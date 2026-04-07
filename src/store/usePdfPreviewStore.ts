import type { pdfType } from '@/types/ResumeFormType';
import { create } from 'zustand';

interface PreviewStore {
  previewUrl: string | null;
  isOpen: boolean;
  name: string;
  openPreview: (value: pdfType, name: string) => void;
  closePreview: () => void;
}

export const usePreviewStore = create<PreviewStore>((set, get) => ({
  previewUrl: null,
  isOpen: false,
  name: '',

  // 비동기 액션으로 만들기
  openPreview: async (value: pdfType, name: string) => {
    if (!value) {
      return;
    }

    set({ isOpen: true, name: name });

    const currentUrl = get().previewUrl;
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }
    let url = '';

    if (value instanceof File) {
      url = URL.createObjectURL(value);
    } else if (typeof value === 'string') {
      url = value;
    }

    set({ previewUrl: url });
  },

  closePreview: () => {
    const currentUrl = get().previewUrl;
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }
    set({ previewUrl: null, isOpen: false });
  },
}));
