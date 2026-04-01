import api from './Axios';
import type { CommentResponse, CreateCommentRequest } from '@/types/Comment';
import type { JobCommentsListResponse } from '@/types/Comment';

export const createComment = async (
  jobId: string,
  body: CreateCommentRequest,
): Promise<CommentResponse> => {
  const { data } = await api.post<CommentResponse>(`/jobs/${jobId}/comments`, body);
  return data;
};

export const getJobComments = async (jobId: string): Promise<JobCommentsListResponse> => {
  const { data } = await api.get<JobCommentsListResponse>(`/jobs/${jobId}/comments`);
  return data;
};
