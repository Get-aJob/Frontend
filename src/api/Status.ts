import api from './Axios';
import type {
  ApplicationRecord,
  ApplicationStatus,
  CreateApplicationPayload,
  UpdateApplicationPayload,
} from '@/types/Status';

// 1. 모든 지원 상태 옵션 가져오기
export const getApplicationStatuses = async (): Promise<ApplicationStatus[]> => {
  const { data } = await api.get<{ statuses: ApplicationStatus[] }>('/applications/statuses');
  return data.statuses;
};

// 2. 내 지원 현황 모두 가져오기
export const getUserApplications = async (): Promise<ApplicationRecord[]> => {
  const { data } = await api.get<{ applications: ApplicationRecord[] }>('/applications/user');
  return data.applications;
};

// 3. 지원하기 (생성)
export const createApplication = async (
  payload: CreateApplicationPayload,
): Promise<ApplicationRecord> => {
  const { data } = await api.post<{ application: ApplicationRecord }>('/applications', payload);
  return data.application;
};

// 4. 지원 정보 및 상태 업데이트 (드래그 앤 드롭에서 사용)
export const updateApplication = async (
  id: string,
  payload: UpdateApplicationPayload,
): Promise<ApplicationRecord> => {
  const { data } = await api.put<{ application: ApplicationRecord }>(
    `/applications/${id}`,
    payload,
  );
  return data.application;
};

// 5. 지원 삭제
export const deleteApplication = async (id: string): Promise<void> => {
  await api.delete(`/applications/${id}`);
};
