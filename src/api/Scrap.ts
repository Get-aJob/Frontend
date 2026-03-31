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

export const getMyScraps = async (): Promise<ScrapItem[]> => {
  const response = await api.get('/scraps');
  return response.data.scraps;
};

export const toggleScrap = async (jobPostingId: string): Promise<{ added: boolean }> => {
  const response = await api.post(`/scraps/${jobPostingId}`);
  return response.data.scrap;
};
