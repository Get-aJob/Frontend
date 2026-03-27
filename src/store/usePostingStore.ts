import { create } from 'zustand';
import { getPostings } from '@/api/Posting';
import type { JobPosting, BackendJob } from '@/types/Posting';

interface PostingState {
  postings: JobPosting[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  fetchPostings: (page: number) => Promise<void>;
}

export const usePostingStore = create<PostingState>((set) => ({
  postings: [],
  currentPage: 1,
  totalPages: 10,
  isLoading: false,
  error: null,
  fetchPostings: async (page: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getPostings(page, 30, 'auto');
      const rawJobs = data.jobs || (Array.isArray(data) ? data : []);
      const sortedJobs = [...rawJobs].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });

      const mappedJobs: JobPosting[] = sortedJobs.map((j: BackendJob) => ({
        id: j.id,
        companyName: j.company_name || 'Unknown',
        companyLogo: j.company_logo,
        title: j.title || 'Untitled',
        url: j.source_url,
        site: j.source_type === 'auto' ? j.source_site_name || '자동크롤링' : '수동등록',
        location: j.location || '전국',
        experienceLevel: j.experience || '경력무관',
        deadline:
          j.deadline_text || (j.deadline ? new Date(j.deadline).toLocaleDateString() : '상시채용'),
      }));

      set({
        postings: mappedJobs,
        currentPage: page,
        totalPages: Math.ceil((data.totalCount || 0) / 30),
        isLoading: false,
      });
    } catch (error: unknown) {
      const err = error as Error;
      set({ isLoading: false, error: err.message || '공고 데이터를 불러오는데 실패했습니다' });
    }
  },
}));
