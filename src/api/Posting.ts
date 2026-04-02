import api from './Axios';
import type { PostingResponse } from '@/types/Posting';

export const getPostings = async (
  page: number,
  size: number = 30,
  sourceType: 'auto' | 'manual' | 'direct' = 'auto',
): Promise<PostingResponse> => {
  const response = await api.get<PostingResponse>(`/jobs`, {
    params: {
      sourceType,
      limit: size,
      offset: (page - 1) * size,
    },
  });
  return response.data;
};
