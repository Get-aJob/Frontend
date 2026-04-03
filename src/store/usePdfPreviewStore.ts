import type { pdfType } from '@/types/ResumeFormType';
import { create } from 'zustand';

interface PreviewStore {
  previewUrl: string | null;
  isOpen: boolean;
  openPreview: (value: pdfType, path?: string) => void;
  closePreview: () => void;
}

export const usePreviewStore = create<PreviewStore>((set, get) => ({
  previewUrl: null,
  isOpen: false,

  // 비동기 액션으로 만들기
  openPreview: async (value: pdfType) => {
    if (!value) {
      return;
    }

    const currentUrl = get().previewUrl;
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }
    let url = '';

    if (value instanceof File) {
      url = URL.createObjectURL(value);
    } else if (typeof value === 'string') {
      console.log(value);
      url = value;
    }

    set({ previewUrl: url, isOpen: true });
  },

  closePreview: () => {
    const currentUrl = get().previewUrl;
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
    }
    set({ previewUrl: null, isOpen: false });
  },
}));
