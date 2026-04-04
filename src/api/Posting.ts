import api from './Axios';
import type {
  PostingResponse,
  DirectJobRequest,
  ManualSaveRequest,
  BackendJob,
} from '@/types/Posting';

export const getPostings = async (
  page: number,
  size: number = 30,
  sourceType: 'auto' | 'manual' | 'direct' = 'auto',
): Promise<PostingResponse> => {
  const url = sourceType === 'direct' ? '/jobs/direct' : '/jobs';
  const params: Record<string, string | number> = {
    limit: size,
    offset: (page - 1) * size,
  };
  if (sourceType !== 'direct') {
    params.sourceType = sourceType;
  }
  const response = await api.get<PostingResponse>(url, { params });
  return response.data;
};

// 직접 입력 공고 생성
export const createDirectJob = async (data: DirectJobRequest): Promise<BackendJob> => {
  const response = await api.post<BackendJob>('/jobs/direct', data);
  return response.data;
};

// 직접 입력 공고 수정(수정 부분은 아직 적용 안함)
export const updateDirectJob = async (
  externalId: string,
  data: Partial<DirectJobRequest>,
): Promise<BackendJob> => {
  // 직접입력 공고 수정을 위해 /jobs/direct/:id 엔드포인트를 사용합니다.
  const response = await api.put<BackendJob>(`/jobs/direct/${externalId}`, data);
  return response.data;
};

// 직접 입력 공고 삭제
export const deleteDirectJob = async (externalId: string): Promise<void> => {
  await api.delete(`/jobs/direct/${externalId}`);
};

// 수동 공고 삭제
export const deleteManualJob = async (externalId: string): Promise<void> => {
  await api.delete(`/jobs/manual/${externalId}`);
};

// URL 크롤링 미리보기
export const manualPreview = async (url: string): Promise<{ preview: Record<string, unknown> }> => {
  const response = await api.post('/jobs/manual/preview', { url }, { timeout: 60000 });
  return response.data;
};

// 크롤링된 공고 저장
export const manualSave = async (data: ManualSaveRequest): Promise<{ job: BackendJob }> => {
  const response = await api.post('/jobs/manual/save', data);
  return response.data;
};
