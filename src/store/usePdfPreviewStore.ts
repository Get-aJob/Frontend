import { getPortfolioPdf } from '@/api/ResumeForm';
import type { pdfType } from '@/types/ResumeFormType';
import { create } from 'zustand';

interface PreviewStore {
  previewUrl: string | null;
  isOpen: boolean;
  openPreview: (value: pdfType, path?: string) => void;
  closePreview: () => void;
}

export const usePreviewStore = create<PreviewStore>((set) => ({
  previewUrl: null,
  isOpen: false,

  // 비동기 액션으로 만들기
  openPreview: async (value: pdfType) => {
    let url = '';

    if (value instanceof File) {
      url = URL.createObjectURL(value);
    } else if (typeof value === 'string') {
      const pdf = await getPortfolioPdf(value);
      url = URL.createObjectURL(pdf);
    }

    set({ previewUrl: url, isOpen: true });
  },

  closePreview: () => set({ previewUrl: null, isOpen: false }),
}));
