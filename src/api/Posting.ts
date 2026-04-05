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
    sourceType,
    limit: String(limit),
    offset: String((page - 1) * limit),
  });

  // 💡 백엔드 요청 규격에 맞춰 파라미터 이름을 'source_site'로 수정했습니다.
  if (site) params.append('source_site', site);

  const response = await api.get(`/jobs?${params.toString()}`);
  return response.data;
};

// 직접 입력(direct) 공고 목록 조회 [새로 추가된 백엔드 라우팅 대응]
export const getDirectJobs = async (
  page: number,
  limit: number,
): Promise<PostingResponse | BackendJob[]> => {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String((page - 1) * limit),
  });

  const response = await api.get(`/jobs/direct?${params.toString()}`);
  return response.data;
};

// 직접 입력 공고 생성
export const createDirectJob = async (data: DirectJobRequest): Promise<BackendJob> => {
  const response = await api.post<BackendJob>('/jobs/direct', data);
  return response.data;
};

// 직접 입력 공고 수정
export const updateDirectJob = async (
  externalId: string,
  data: Partial<DirectJobRequest>,
): Promise<BackendJob> => {
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

// 크롤링된 수동 공고 DB 저장
export const manualSave = async (data: ManualSaveRequest): Promise<{ job: BackendJob }> => {
  const response = await api.post('/jobs/manual/save', data);
  return response.data;
};
