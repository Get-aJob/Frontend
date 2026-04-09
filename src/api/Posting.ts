import api from './Axios';
import type {
  PostingResponse,
  DirectJobRequest,
  ManualSaveRequest,
  BackendJob,
} from '@/types/Posting';

// 자동(auto) 및 수동(manual) 공고 조회
export const getPostings = async (
  page: number,
  limit: number,
  sourceType: string,
  site?: string,
): Promise<PostingResponse> => {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String((page - 1) * limit),
  });

  if (site) params.append('sourceSite', site);
  if (sourceType === 'auto') params.append('sourceType', 'auto');

  // sourceType이 manual이면 본인 공고만 가져오는 엔드포인트(/jobs/manual) 호출
  const url = sourceType === 'manual' ? '/jobs/manual' : '/jobs';
  const response = await api.get(`${url}?${params.toString()}`);
  return response.data;
};

// 직접 입력(direct) 공고 목록 조회 -> 수동 등록(manual)과 통합
export const getDirectJobs = async (
  page: number,
  limit: number,
): Promise<PostingResponse | BackendJob[]> => {
  const params = new URLSearchParams({
    sourceType: 'manual',
    limit: String(limit),
    offset: String((page - 1) * limit),
  });

  const response = await api.get(`/jobs/manual?${params.toString()}`);
  return response.data;
};

// 직접 입력 공고 생성 -> 수동(manual) 엔드포인트 사용
export const createDirectJob = async (data: DirectJobRequest): Promise<BackendJob> => {
  const response = await api.post<BackendJob>('/jobs/manual', data);
  return response.data;
};

// 직접 입력 공고 수정 -> 수동(manual) 엔드포인트 사용
export const updateDirectJob = async (
  externalId: string,
  data: Partial<DirectJobRequest>,
): Promise<BackendJob> => {
  const response = await api.put<BackendJob>(`/jobs/manual/${externalId}`, data);
  return response.data;
};

// 직접 입력 공고 삭제 -> 수동(manual) 엔드포인트 사용
export const deleteDirectJob = async (externalId: string): Promise<void> => {
  await api.delete(`/jobs/manual/${externalId}`);
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

// 크롤링된 수동 공고 DB 저장 -> 수동(manual) 저장 엔드포인트로 통일
export const manualSave = async (data: ManualSaveRequest): Promise<{ job: BackendJob }> => {
  const response = await api.post('/jobs/manual', data);
  return response.data;
};

// 조회수 증가 API
export const incrementViewCount = async (jobId: string | number): Promise<void> => {
  try {
    await api.patch(`/jobs/${jobId}/view`);
  } catch (error: unknown) {
    console.error('조회수 증가 실패:', error);
  }
};
