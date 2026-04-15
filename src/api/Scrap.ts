import api from './Axios';

export interface ScrapItem {
  jobPostingId: string;
  title: string;
  companyName: string;
  deadline: string;
  location: string;
  experience: string;
  isApplied: boolean;
  expired: boolean;
  companyLogo: string | null;
  createdAt: string;
}

export interface Pagination {
  totalCount: number;
  hasNext: boolean;
  nextOffset: number;
  limit: number;
  offset: number;
}

export interface Scrap {
  scraps: ScrapItem[];
  pagination: Pagination;
}

export type ScrapSortType = 'latest' | 'deadline';

export const getMyScraps = async (
  page?: number,
  limit?: number,
  sortBy?: ScrapSortType,
): Promise<Scrap> => {
  const PAGE = page ?? 1;
  const LIMIT = limit ?? 30;
  const OFFSET = (PAGE - 1) * LIMIT;
  const response = await api.get(
    `/scraps?limit=${LIMIT}&offset=${OFFSET}&sortBy=${sortBy ?? 'latest'}`,
  );
  return response.data;
};

export const toggleScrap = async (jobPostingId: string): Promise<{ added: boolean }> => {
  const response = await api.post(`/scraps/${jobPostingId}`);
  return response.data.scrap;
};
