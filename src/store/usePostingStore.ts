import { create } from 'zustand';
import {
  getPostings,
  createDirectJob,
  updateDirectJob,
  deleteDirectJob,
  deleteManualJob,
  manualPreview,
  manualSave,
} from '@/api/Posting';
import { getMyScraps } from '@/api/Scrap';
import type {
  JobPosting,
  BackendJob,
  DirectJobRequest,
  ManualSaveRequest,
  PostingResponse,
} from '@/types/Posting';

interface ExtendedJobPosting extends JobPosting {
  isScrapped?: boolean;
}

interface PostingState {
  postings: ExtendedJobPosting[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  sourceType: 'auto' | 'manual' | 'direct';
  setSourceType: (type: 'auto' | 'manual' | 'direct') => void;
  fetchPostings: (page: number) => Promise<void>;
  toggleScrapStatus: (jobId: string | number) => void;
  createJob: (data: DirectJobRequest) => Promise<void>;
  updateJob: (externalId: string, data: Partial<DirectJobRequest>) => Promise<void>;
  deleteJob: (externalId: string, type?: string) => Promise<void>;
  parseJobUrl: (url: string) => Promise<Record<string, unknown>>;
  saveParsedJob: (data: ManualSaveRequest) => Promise<void>;
}

export const usePostingStore = create<PostingState>((set, get) => ({
  postings: [],
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
  sourceType: 'auto',

  setSourceType: (type) => {
    set({ sourceType: type, currentPage: 1 });
    get().fetchPostings(1);
  },

  fetchPostings: async (page: number) => {
    set({ isLoading: true, error: null });
    try {
      const PAGE_SIZE = 30;
      const currentSourceType = get().sourceType;

      // 공고 목록과 내 스크랩 목록을 동시에 가져옴
      let data: PostingResponse;
      if (currentSourceType === 'auto') {
        data = await getPostings(page, PAGE_SIZE, 'auto');
      } else {
        // manual과 direct 공고를 모두 가져와서 합침 (사용자 입장에서는 모두 내가 등록한 공고에서 확인 가능)
        const [manualData, directData] = await Promise.all([
          getPostings(1, 100, 'manual'),
          getPostings(1, 100, 'direct'),
        ]);

        const manualJobs = Array.isArray(manualData) ? manualData : manualData.jobs || [];
        const directJobs = Array.isArray(directData) ? directData : directData.jobs || [];

        data = {
          jobs: [...manualJobs, ...directJobs],
          totalCount: manualJobs.length + directJobs.length,
        };
      }

      const [scrapData] = await Promise.all([getMyScraps().catch(() => [])]);

      const scrappedIds = new Set(scrapData.map((s) => String(s.jobPostingId)));

      const rawJobs = data.jobs || (Array.isArray(data) ? data : []);
      const totalCount = data.totalCount || rawJobs.length;

      const sortedJobs = [...rawJobs].sort((a: BackendJob, b: BackendJob) => {
        const dateA =
          a.created_at || a.createdAt ? new Date(a.created_at || a.createdAt).getTime() : 0;
        const dateB =
          b.created_at || b.createdAt ? new Date(b.created_at || b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      const mappedJobs: ExtendedJobPosting[] = sortedJobs.map((jObj: BackendJob) => {
        const j = jObj;
        let finalDeadline = '상시채용';
        const deadline = j.deadline;
        const deadlineText = j.deadline_text || j.deadlineText;

        if (deadline) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const targetDate = new Date(deadline);
          targetDate.setHours(0, 0, 0, 0);

          const diffTime = targetDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 0) finalDeadline = 'D-Day';
          else if (diffDays > 0) finalDeadline = `D-${diffDays}`;
          else finalDeadline = `마감 (D+${Math.abs(diffDays)})`;
        } else if (deadlineText) {
          if (deadlineText.includes('상시')) finalDeadline = '상시채용';
          else finalDeadline = deadlineText;
        }

        const sourceType = j.source_type || j.sourceType;

        return {
          id: j.id,
          companyName: j.company_name || j.companyName || '회사명 미상',
          companyLogo: j.company_logo || j.companyLogo,
          title: j.title || '제목 없음',
          url: j.source_url || j.sourceUrl,
          site:
            sourceType === 'auto'
              ? j.source_site_name || j.sourceSiteName || '자동크롤링'
              : '수동등록',
          location: j.location || '전국',
          experienceLevel: j.experience || '경력무관',
          deadline: finalDeadline,
          isScrapped: scrappedIds.has(String(j.id)),
          sourceType: sourceType,
          externalId: j.external_id || j.externalId,
          description: (() => {
            if (!j.content) return '';
            if (typeof j.content === 'object')
              return (j.content as Record<string, unknown>).description || '';
            try {
              const parsed = JSON.parse(j.content);
              return typeof parsed === 'object' ? parsed.description || '' : j.content;
            } catch {
              return j.content;
            }
          })(),
        };
      });

      set({
        postings: mappedJobs,
        currentPage: page,
        totalPages: Math.ceil(totalCount / PAGE_SIZE),
        isLoading: false,
      });
    } catch (error: unknown) {
      const err = error as Error;
      set({
        isLoading: false,
        error: err.message || '공고 데이터를 불러오는데 실패했습니다',
      });
    }
  },

  toggleScrapStatus: (jobId: string | number) => {
    set((state) => ({
      postings: state.postings.map((job) =>
        String(job.id) === String(jobId) ? { ...job, isScrapped: !job.isScrapped } : job,
      ),
    }));
  },

  createJob: async (data) => {
    set({ isLoading: true });
    try {
      await createDirectJob(data);
      await get().fetchPostings(1);
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateJob: async (externalId, data) => {
    set({ isLoading: true });
    try {
      await updateDirectJob(externalId, data);
      await get().fetchPostings(get().currentPage);
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteJob: async (externalId, type) => {
    set({ isLoading: true });
    try {
      if (type === 'manual') {
        await deleteManualJob(externalId);
      } else {
        await deleteDirectJob(externalId);
      }
      await get().fetchPostings(get().currentPage);
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  parseJobUrl: async (url) => {
    const result = await manualPreview(url);
    return result.preview;
  },

  saveParsedJob: async (data) => {
    set({ isLoading: true });
    try {
      await manualSave(data);
      await get().fetchPostings(1);
    } catch (err) {
      set({ error: (err as Error).message });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));
