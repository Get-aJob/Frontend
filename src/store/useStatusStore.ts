import { create } from 'zustand';
import { getUserApplications, getApplicationStatuses } from '@/api/Status';
import type { ApplicationRecord, ApplicationStatus } from '@/types/Status';

interface StatusState {
  applications: ApplicationRecord[];
  statuses: ApplicationStatus[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;

  // ✨ 상세 슬라이드 관리를 위한 전역 상태 추가
  selectedApplication: ApplicationRecord | null;
  setSelectedApplication: (app: ApplicationRecord | null) => void;
}

export const useStatusStore = create<StatusState>((set) => ({
  applications: [],
  statuses: [],
  isLoading: false,
  error: null,
  selectedApplication: null,
  setSelectedApplication: (app) => set({ selectedApplication: app }),

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [apps, stats] = await Promise.all([getUserApplications(), getApplicationStatuses()]);
      set({ applications: apps, statuses: stats, isLoading: false });
    } catch (err) {
      console.error('데이터 로드 실패:', err);
      const errorMessage = err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.';
      set({ error: errorMessage, isLoading: false });
    }
  },
}));
