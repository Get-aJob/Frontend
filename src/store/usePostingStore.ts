import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  getPostings,
  getDirectJobs,
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

interface PostingState {
  postings: ExtendedJobPosting[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  sourceSites: string[];
  selectedSite: string;
  error: string | null;
  sourceType: 'auto' | 'manual' | 'direct';
  setSourceType: (type: 'auto' | 'manual' | 'direct') => void;
  setSelectedSite: (site: string) => void;
  fetchPostings: (page: number, site?: string) => Promise<void>;
  toggleScrapStatus: (jobId: string | number) => void;
  createJob: (data: DirectJobRequest) => Promise<void>;
  updateJob: (externalId: string, data: Partial<DirectJobRequest>, type?: string) => Promise<void>;
  deleteJob: (externalId: string, type?: string) => Promise<void>;
  parseJobUrl: (url: string) => Promise<Record<string, unknown>>;
  saveParsedJob: (data: ManualSaveRequest) => Promise<void>;
}

export const usePostingStore = create<PostingState>()(
  persist(
    (set, get) => ({
      postings: [],
      currentPage: 1,
      totalPages: 1,
      isLoading: false,
      sourceSites: [],
      selectedSite: '',
      error: null,
      sourceType: 'auto',

      setSourceType: (type) => {
        set({ sourceType: type, currentPage: 1, selectedSite: '' });
        get().fetchPostings(1);
      },

      setSelectedSite: (site) => {
        set({ selectedSite: site, currentPage: 1 });
        get().fetchPostings(1, site);
      },

      fetchPostings: async (page: number, site?: string) => {
        set({ isLoading: true, error: null });
        try {
          const PAGE_SIZE = 30;
          const currentSourceType = get().sourceType;
          const currentSite = site !== undefined ? site : get().selectedSite;
          const isLoggedIn = useAuthStore.getState().isLoggedIn;

          let data: PostingResponse = { jobs: [], totalCount: 0 };

          if (currentSourceType === 'auto') {
            data = await getPostings(page, PAGE_SIZE, 'auto', currentSite);
          } else if (!isLoggedIn) {
            set({ postings: [], totalPages: 1, isLoading: false, sourceSites: [] });
            return;
          } else {
            // [핵심수정] manual은 /jobs?sourceType=manual, direct는 /jobs/direct 엔드포인트로 각각 호출
            const [manualData, directData] = await Promise.all([
              getPostings(page, PAGE_SIZE, 'manual'),
              getDirectJobs(page, PAGE_SIZE),
            ]);

            const manualJobs = Array.isArray(manualData)
              ? manualData
              : (manualData as PostingResponse).jobs || [];

            const directJobs = Array.isArray(directData)
              ? directData
              : (directData as PostingResponse).jobs || [];

            const manualTotal = Array.isArray(manualData)
              ? manualData.length
              : (manualData.totalCount ?? manualJobs.length);

            const directTotal = Array.isArray(directData)
              ? directData.length
              : (directData.totalCount ?? directJobs.length);

            data = {
              jobs: [...manualJobs, ...directJobs],
              totalCount: manualTotal + directTotal,
              sourceSites: [],
            };
          }

          const scrapData: ScrapItem[] = useAuthStore.getState().isLoggedIn
            ? await getMyScraps().catch(() => [])
            : [];
          const scrappedIds = new Set(scrapData.map((s: ScrapItem) => String(s.jobPostingId)));

          const rawJobs = data.jobs || [];
          const totalCount = data.totalCount || rawJobs.length;

          const sortedJobs = [...rawJobs].sort((a: BackendJob, b: BackendJob) => {
            const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
            const dateB = new Date(b.created_at || b.createdAt || 0).getTime();
            return dateB - dateA;
          });

          const mappedJobs: ExtendedJobPosting[] = sortedJobs.map((j: BackendJob) => {
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
              finalDeadline = deadlineText.includes('상시') ? '상시채용' : deadlineText;
            }

            const sourceType = j.source_type || j.sourceType || 'manual';
            const finalSourceType = sourceType === 'auto' ? 'auto' : sourceType;

            return {
              id: j.id,
              companyName: j.company_name || j.companyName || '회사명 미상',
              companyLogo: j.company_logo || j.companyLogo,
              title: j.title || '제목 없음',
              url: j.source_url || j.sourceUrl,
              site:
                finalSourceType === 'auto'
                  ? j.source_site_name || j.sourceSiteName || '자동크롤링'
                  : '수동등록',
              location: j.location || '전국',
              experienceLevel: j.experience || '경력무관',
              deadline: finalDeadline,
              isScrapped: scrappedIds.has(String(j.id)),
              sourceType: finalSourceType,
              externalId: j.external_id || j.externalId || String(j.id),
              description: j.description || parseDescription(j.content),
            };
          });

          set({
            postings: mappedJobs,
            currentPage: page,
            totalPages: Math.ceil(totalCount / PAGE_SIZE) || 1,
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

      // [핵심수정] JobModal에서 PUT /jobs/direct/:externalId 로 통일하여 쏘므로 단일 로직으로 단순화
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
        if (type !== 'manual' && type !== 'auto' && type !== 'direct') {
          set({ error: 'Invalid job type: ' + type });
          return;
        }
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
    }),
    {
      name: 'posting-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ sourceType: state.sourceType }),
    },
  ),
);
