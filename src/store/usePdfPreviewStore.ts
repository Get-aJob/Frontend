import { supabase } from '@/api/Supabase';
import type { pdfType } from '@/types/ResumeFormType';
import { create } from 'zustand';

interface PreviewStore {
  previewUrl: string | null;
  isOpen: boolean;
  openPreview: (value: pdfType, path?: string) => void;
  closePreview: () => void;
}

export const getPrivateFileUrl = async (bucket: string, path: string, expiresIn = 60) => {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
};

export const usePreviewStore = create<PreviewStore>((set) => ({
  previewUrl: null,
  isOpen: false,

  // 비동기 액션으로 만들기
  openPreview: async (value: pdfType) => {
    let url = '';

    if (value instanceof File) {
      url = URL.createObjectURL(value);
    }
    /* 
    else if (isSupabaseRef(value)) {
      const fileUrl = path;
      console.log(path);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log(session); // null이면 인증이 안 된 상태
      const fileName = fileUrl?.split('/storage/v1/object/public/portfolios/')[1];
      console.log(fileName);
      const { data, error } = await supabase.storage
        .from('portfolios')
        .createSignedUrl(fileName!, 60);
      if (error) {
        console.log('에러 내용' + error);
      }
      url = data?.signedUrl ?? '';
    }
      */

    set({ previewUrl: url, isOpen: true });
  },

  closePreview: () => set({ previewUrl: null, isOpen: false }),
}));
