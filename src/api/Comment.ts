import api from './Axios';
import type { CommentResponse, CreateCommentRequest } from '@/types/Comment';
import type { JobCommentsListResponse } from '@/types/Comment';
import type { JobCommentApiItem } from '@/types/Comment';

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

export const updateComment = async (
  jobId: string,
  commentId: string,
  body: CreateCommentRequest,
): Promise<JobCommentApiItem> => {
  const { data } = await api.put<{ comment: JobCommentApiItem }>(
    `/jobs/${jobId}/comments/${commentId}`,
    body,
  );
  return data.comment;
};

export const deleteComment = async (jobId: string, commentId: string): Promise<void> => {
  await api.delete(`/jobs/${jobId}/comments/${commentId}`);
};
