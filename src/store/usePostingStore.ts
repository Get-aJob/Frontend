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

interface ExtendedJobPosting extends JobPosting {
  isScrapped?: boolean;
}

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
  error: string | null;
  sourceType: 'auto' | 'manual' | 'direct';
  setSourceType: (type: 'auto' | 'manual' | 'direct') => void;
  fetchPostings: (page: number) => Promise<void>;
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
          const isLoggedIn = useAuthStore.getState().isLoggedIn;

          let data: PostingResponse;
          if (currentSourceType === 'auto') {
            data = await getPostings(page, PAGE_SIZE, 'auto');
          } else if (!isLoggedIn) {
            set({ postings: [], totalPages: 1, isLoading: false });
            return;
          } else {
            const [manualData, directData] = await Promise.all([
              getPostings(page, PAGE_SIZE, 'manual'),
              getPostings(page, PAGE_SIZE, 'direct'),
            ]);

            const manualJobs = Array.isArray(manualData) ? manualData : manualData.jobs || [];
            const directJobs = Array.isArray(directData) ? directData : directData.jobs || [];

            const manualTotal = Array.isArray(manualData)
              ? manualData.length
              : (manualData.totalCount ?? manualJobs.length);
            const directTotal = Array.isArray(directData)
              ? directData.length
              : (directData.totalCount ?? directJobs.length);

            data = {
              jobs: [...manualJobs, ...directJobs],
              totalCount: manualTotal + directTotal,
            };
          }

          const scrapData: ScrapItem[] = useAuthStore.getState().isLoggedIn
            ? await getMyScraps().catch(() => [])
            : [];
          const scrappedIds = new Set(scrapData.map((s: ScrapItem) => String(s.jobPostingId)));

          const rawJobs = data.jobs || (Array.isArray(data) ? data : []);
          const totalCount = data.totalCount || rawJobs.length;

          const sortedJobs = [...rawJobs].sort((a: BackendJob, b: BackendJob) => {
            const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
            const dateB = new Date(b.created_at || b.createdAt || 0).getTime();
            return dateB - dateA;
          });

          const mappedJobs: ExtendedJobPosting[] = sortedJobs.map((j: BackendJob) => {
            let finalDeadline = '상시채용';
            const deadline = j.deadline;
            // 백엔드 응답이 스네이크 케이스(deadline_text)와 카멜 케이스(deadlineText)가 혼용될 수 있으므로 둘 다 체크
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

            // 백엔드 필드명 혼용 대응 (source_type vs sourceType, company_name vs companyName 등)
            const sourceType = j.source_type || j.sourceType || 'manual';
            const finalSourceType = sourceType === 'auto' ? 'auto' : sourceType;

            const companyName = j.company_name || j.companyName || '회사명 미상';
            const companyLogo = j.company_logo || j.companyLogo;
            const sourceUrl = j.source_url || j.sourceUrl;
            const externalId = j.external_id || j.externalId || String(j.id);
            const description = parseDescription(j.content);

            return {
              id: j.id,
              companyName,
              companyLogo,
              title: j.title || '제목 없음',
              url: sourceUrl,
              site:
                finalSourceType === 'auto'
                  ? j.source_site_name || j.sourceSiteName || '자동크롤링'
                  : '수동등록',
              location: j.location || '전국',
              experienceLevel: j.experience || '경력무관',
              deadline: finalDeadline,
              isScrapped: scrappedIds.has(String(j.id)),
              sourceType: finalSourceType,
              externalId: externalId,
              description: description,
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

      updateJob: async (externalId, data, type) => {
        set({ isLoading: true });
        try {
          if (type === 'manual') {
            // 수동(manual) 크롤링 공고는 saveParsedJob (POST /jobs/manual/save) 엔드포인트를
            // 사용하여 upsert 방식으로 업데이트를 시도합니다.
            await get().saveParsedJob({
              title: data.title || '',
              companyName: data.companyName || '',
              externalId,
              sourceUrl: data.sourceUrl || '',
              companyLogo: data.companyLogo,
              location: data.location,
              experience: data.experience,
              deadline: data.deadline,
              content: data.description || '',
            });
          } else {
            // 직접(direct) 입력 및 자동(auto) 수집 공고는 전용 업데이트 API를 호출합니다.
            await updateDirectJob(externalId, data);
          }
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
            // 'auto'와 'direct'는 모두 /jobs/direct 엔드포인트를 사용한다고 가정하거나,
            // 필요 시 서버 API 설계에 맞게 분기합니다.
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
