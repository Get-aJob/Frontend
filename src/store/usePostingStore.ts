import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  getPostings,
  createDirectJob,
  updateDirectJob,
  deleteDirectJob,
  deleteManualJob,
  manualPreview,
  manualSave,
} from '@/api/Posting';
import { getMyScraps, type ScrapItem } from '@/api/Scrap';
import { useAuthStore } from '@/store/useAuthStore';
import type {
  JobPosting,
  BackendJob,
  DirectJobRequest,
  ManualSaveRequest,
  PostingResponse,
} from '@/types/Posting';

export interface ExtendedJobPosting extends JobPosting {
  isScrapped?: boolean;
  rawDeadline?: string; // 수정 폼 등을 위해 원본 날짜 보관
}

// 💡 any 타입 대체를 위해 백엔드 원본 데이터 스키마를 엄격하게 확장
export interface ExtendedBackendJob extends BackendJob {
  comment_count?: number;
  commentCount?: number;
  view_count?: number;
  viewCount?: number;
  source_site_name?: string;
  sourceSiteName?: string;
  deadline_text?: string;
  deadlineText?: string;
  company_name?: string;
  companyName?: string;
  company_logo?: string;
  companyLogo?: string;
  source_url?: string;
  sourceUrl?: string;
  source_type?: string;
  sourceType?: string;
  external_id?: string;
  externalId?: string;
  created_at?: string;
  createdAt?: string;
}

// 공고 상세 내용(JSON 또는 문자열)을 파싱하는 헬퍼 함수
const parseDescription = (content: string | Record<string, unknown> | undefined): string => {
  if (!content) return '';
  if (typeof content === 'object') return (content.description as string) || '';
  try {
    const parsed = JSON.parse(content);
    return typeof parsed === 'object' && parsed !== null ? parsed.description || '' : content;
  } catch {
    return content;
  }
};

// 로컬 날짜 포맷터 (YYYY-MM-DD)
const formatLocalDate = (date: string | Date): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface PostingState {
  postings: ExtendedJobPosting[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  isLoading: boolean;
  sourceSites: string[];
  selectedSite: string;
  error: string | null;
  sourceType: 'auto' | 'manual';
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  setSourceType: (type: 'auto' | 'manual') => void;
  setSelectedSite: (site: string) => void;
  fetchPostings: (page: number, site?: string, keyword?: string) => Promise<void>;
  toggleScrapStatus: (jobId: string | number) => void;
  createJob: (data: DirectJobRequest) => Promise<void>;
  updateJob: (externalId: string, data: Partial<DirectJobRequest>, type?: string) => Promise<void>;
  deleteJob: (externalId: string, type?: string) => Promise<void>;
  parseJobUrl: (url: string) => Promise<Record<string, unknown>>;
  saveParsedJob: (data: ManualSaveRequest) => Promise<void>;
  updateCommentCount: (jobId: string | number, delta: number) => void;
  updateViewCount: (jobId: string | number) => void;
  resetFilters: () => void;
}

export const usePostingStore = create<PostingState>()(
  persist(
    (set, get) => ({
      postings: [],
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      isLoading: false,
      sourceSites: [],
      selectedSite: '',
      error: null,
      sourceType: 'auto',
      searchKeyword: '',

      setSearchKeyword: (keyword) => {
        set({ searchKeyword: keyword, currentPage: 1 });
      },

      setSourceType: (type) => {
        set({ sourceType: type, currentPage: 1, selectedSite: '' });
        get().fetchPostings(1);
      },

      setSelectedSite: (site) => {
        set({ selectedSite: site, currentPage: 1 });
        get().fetchPostings(1, site);
      },

      fetchPostings: async (page: number, site?: string, keyword?: string) => {
        set({ isLoading: true, error: null });
        try {
          const PAGE_SIZE = 30;
          const currentSourceType = get().sourceType;
          const currentSite = site !== undefined ? site : get().selectedSite;
          const currentKeyword = keyword !== undefined ? keyword : get().searchKeyword;
          const isLoggedIn = useAuthStore.getState().isLoggedIn;

          let data: PostingResponse = { jobs: [], totalCount: 0 };

          if (currentSourceType === 'auto') {
            data = await getPostings(page, PAGE_SIZE, 'auto', currentSite, currentKeyword);
          } else if (!isLoggedIn) {
            set({
              postings: [],
              totalPages: 1,
              totalCount: 0,
              isLoading: false,
              sourceSites: [],
            });
            return;
          } else {
            data = await getPostings(page, PAGE_SIZE, 'manual', undefined, currentKeyword);
          }

          const scrapData: ScrapItem[] = useAuthStore.getState().isLoggedIn
            ? await getMyScraps().catch(() => [])
            : [];
          const scrappedIds = new Set(scrapData.map((s: ScrapItem) => String(s.jobPostingId)));

          const rawJobs = data.jobs || [];
          const totalCount = data.totalCount || rawJobs.length;

          const sortedJobs = [...rawJobs].sort((a: BackendJob, b: BackendJob) => {
            const extA = a as ExtendedBackendJob;
            const extB = b as ExtendedBackendJob;
            const dateA = new Date(extA.created_at || extA.createdAt || 0).getTime();
            const dateB = new Date(extB.created_at || extB.createdAt || 0).getTime();
            return dateB - dateA;
          });

          const mappedJobs: ExtendedJobPosting[] = sortedJobs.map((j: BackendJob) => {
            const jobData = j as ExtendedBackendJob;

            const deadline = jobData.deadline;
            const deadlineText = jobData.deadline_text || jobData.deadlineText;

            const sourceType = jobData.source_type || jobData.sourceType || 'manual';
            const finalSourceType = sourceType === 'auto' ? 'auto' : 'manual';

            return {
              id: jobData.id,
              companyName: jobData.company_name || jobData.companyName || '회사명 미상',
              companyLogo: jobData.company_logo || jobData.companyLogo,
              title: jobData.title || '제목 없음',
              url: jobData.source_url || jobData.sourceUrl,
              site:
                finalSourceType === 'auto'
                  ? jobData.source_site_name || jobData.sourceSiteName || '자동 공고'
                  : '수동 공고',
              location: jobData.location || '전국',
              experienceLevel: jobData.experience || '경력무관',
              deadline: deadline || deadlineText || '상시채용',
              rawDeadline: deadline ? formatLocalDate(deadline) : undefined,
              isScrapped: scrappedIds.has(String(jobData.id)),
              sourceType: finalSourceType,
              externalId: jobData.external_id || jobData.externalId || String(jobData.id),
              description: jobData.description || parseDescription(jobData.content),
              commentCount: jobData.comment_count || jobData.commentCount || 0,
              viewCount: jobData.view_count || jobData.viewCount || 0,
            };
          });

          set({
            postings: mappedJobs,
            currentPage: page,
            totalPages: Math.ceil(totalCount / PAGE_SIZE) || 1,
            totalCount: totalCount,
            isLoading: false,
            sourceSites: data.sourceSites || get().sourceSites,
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
        if (type !== 'manual' && type !== 'auto') {
          set({ error: '유효하지 않은 공고 타입입니다: ' + type });
          return;
        }
        set({ isLoading: true });
        try {
          if (type === 'manual') {
            await deleteManualJob(externalId);
          } else {
            // 자동 수집 공고 삭제(현재 지원되지 않으나 확장을 위해 분리)
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
        set({ isLoading: true, error: null });
        try {
          const result = await manualPreview(url);
          return result.preview;
        } catch (err) {
          set({ error: (err as Error).message });
          throw err;
        } finally {
          set({ isLoading: false });
        }
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

      updateCommentCount: (jobId: string | number, delta: number) => {
        set((state) => ({
          postings: state.postings.map((job) =>
            String(job.id) === String(jobId)
              ? { ...job, commentCount: Math.max(0, (job.commentCount || 0) + delta) }
              : job,
          ),
        }));
      },

      updateViewCount: (jobId: string | number) => {
        set((state) => ({
          postings: state.postings.map((job) =>
            String(job.id) === String(jobId)
              ? { ...job, viewCount: (job.viewCount || 0) + 1 }
              : job,
          ),
        }));
      },

      resetFilters: () => {
        set({ sourceType: 'auto', selectedSite: '', currentPage: 1, searchKeyword: '' });
      },
    }),
    {
      name: 'posting-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ sourceType: state.sourceType }),
    },
  ),
);
