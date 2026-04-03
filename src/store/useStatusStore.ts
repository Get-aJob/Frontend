import { create } from 'zustand';
import { getApplicationById, getApplicationStatusOptions, getUserApplications } from '@/api/Status';
import type { ApplicationRecord, ApplicationStatusOption } from '@/types/Status';

interface StatusState {
  applications: ApplicationRecord[];
  statuses: string[];
  statusOptions: ApplicationStatusOption[];
  applicationDetail: ApplicationRecord | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  error: string | null;
  detailError: string | null;
  fetchApplications: () => Promise<void>;
  fetchApplicationDetail: (id: string) => Promise<void>;
  clearApplicationDetail: () => void;
}

export const useStatusStore = create<StatusState>((set) => ({
  applications: [],
  statuses: [],
  statusOptions: [],
  applicationDetail: null,
  isLoading: false,
  isDetailLoading: false,
  error: null,
  detailError: null,
  fetchApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const [applicationsResult, statusesResult] = await Promise.allSettled([
        getUserApplications(),
        getApplicationStatusOptions(),
      ]);

      const applications = applicationsResult.status === 'fulfilled' ? applicationsResult.value : [];
      const statusOptions = statusesResult.status === 'fulfilled' ? statusesResult.value : [];
      const statuses = statusOptions.map((item) => item.name);

      set({ applications, statuses, statusOptions, isLoading: false });

      if (applicationsResult.status === 'rejected') {
        throw applicationsResult.reason;
      }
    } catch (error: unknown) {
      const err = error as Error;
      set({
        isLoading: false,
        error: err.message || '지원 현황 데이터를 불러오지 못했습니다',
      });
    }
  },
  fetchApplicationDetail: async (id: string) => {
    set({ isDetailLoading: true, detailError: null });
    try {
      const detail = await getApplicationById(id);
      set({ applicationDetail: detail, isDetailLoading: false });
    } catch (error: unknown) {
      const err = error as Error;
      set({
        isDetailLoading: false,
        detailError: err.message || '지원 상세 데이터를 불러오지 못했습니다',
      });
    }
  },
  clearApplicationDetail: () => set({ applicationDetail: null, detailError: null, isDetailLoading: false }),
}));
