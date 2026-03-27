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
  totalPages: 1,
  isLoading: false,
  error: null,

  fetchPostings: async (page: number) => {
    set({ isLoading: true, error: null });
    try {
      const PAGE_SIZE = 30;
      const data = await getPostings(page, PAGE_SIZE, 'auto');

      const rawJobs = data.jobs || (Array.isArray(data) ? data : []);
      const totalCount = data.totalCount || rawJobs.length;

      const sortedJobs = [...rawJobs].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });

      const mappedJobs: JobPosting[] = sortedJobs.map((j: BackendJob) => {
        let finalDeadline = '상시채용';

        if (j.deadline) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const targetDate = new Date(j.deadline);
          targetDate.setHours(0, 0, 0, 0);

          const diffTime = targetDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 0) finalDeadline = 'D-Day';
          else if (diffDays > 0) finalDeadline = `D-${diffDays}`;
          else finalDeadline = `마감 (D+${Math.abs(diffDays)})`;
        } else if (j.deadline_text) {
          if (j.deadline_text.includes('상시')) finalDeadline = '상시채용';
          else finalDeadline = j.deadline_text;
        }

        return {
          id: j.id,
          companyName: j.company_name || 'Unknown',
          companyLogo: j.company_logo,
          title: j.title || 'Untitled',
          url: j.source_url,
          site: j.source_type === 'auto' ? j.source_site_name || '자동크롤링' : '수동등록',
          location: j.location || '전국',
          experienceLevel: j.experience || '경력무관',
          deadline: finalDeadline,
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
}));
