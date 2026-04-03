import api from './Axios';
import type {
  ApplicationDetailResponse,
  ApplicationRecord,
  ApplicationStatusOption,
  ApplicationsResponse,
} from '@/types/Status';

export const getUserApplications = async (): Promise<ApplicationRecord[]> => {
  const response = await api.get<ApplicationRecord[] | ApplicationsResponse>('/applications/user');
  const payload = response.data;

  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.applications)) return payload.applications;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
};

export const getApplicationById = async (id: string): Promise<ApplicationRecord> => {
  const response = await api.get<ApplicationRecord | ApplicationDetailResponse>(`/applications/${id}`);
  const payload = response.data;

  if ('id' in payload) return payload;
  if (payload.application) return payload.application;
  if (payload.item) return payload.item;
  if (payload.data) return payload.data;

  throw new Error('지원 상세 데이터를 불러오지 못했습니다');
};

export const createApplication = async (applicationData: {
  jobPostingId: string;
  notes: string;
}): Promise<ApplicationRecord> => {
  const response = await api.post<ApplicationRecord>('/applications', applicationData);
  return response.data;
};

export const updateApplication = async (
  id: string,
  applicationData: { notes: string; statusId?: string }
): Promise<ApplicationRecord> => {
  const response = await api.put<ApplicationRecord>(`/applications/${id}`, applicationData);
  return response.data;
}

export const deleteApplication = async (id: string): Promise<void> => {
  await api.delete(`/applications/${id}`);
};

const toStatusOption = (value: unknown): ApplicationStatusOption | null => {
  if (typeof value === 'string') {
    const name = value.trim();
    if (!name) return null;
    return { id: name, name };
  }

  if (value && typeof value === 'object') {
    const candidate = value as {
      id?: unknown;
      code?: unknown;
      displayName?: unknown;
      name?: unknown;
    };

    const nameCandidate =
      typeof candidate.displayName === 'string'
        ? candidate.displayName
        : typeof candidate.name === 'string'
          ? candidate.name
          : typeof candidate.code === 'string'
            ? candidate.code
            : null;

    if (!nameCandidate?.trim()) return null;

    const idCandidate =
      typeof candidate.id === 'string' && candidate.id.trim() ? candidate.id : nameCandidate;

    return { id: idCandidate, name: nameCandidate };
  }

  return null;
};

const normalizeStatusOptions = (list: unknown[]): ApplicationStatusOption[] => {
  const mapped = list
    .map(toStatusOption)
    .filter((value): value is ApplicationStatusOption => Boolean(value));

  const unique = new Map<string, ApplicationStatusOption>();
  mapped.forEach((item) => {
    if (!unique.has(item.name)) unique.set(item.name, item);
  });

  return Array.from(unique.values());
};

export const getApplicationStatusOptions = async (): Promise<ApplicationStatusOption[]> => {
  const response = await api.get<
    | string[]
    | { statuses?: unknown[]; items?: unknown[]; data?: unknown[] }
    | { id?: string; code?: string; displayName?: string }[]
  >('/applications/statuses');

  const payload = response.data;
  if (Array.isArray(payload)) return normalizeStatusOptions(payload);

  if (Array.isArray(payload.statuses)) return normalizeStatusOptions(payload.statuses);
  if (Array.isArray(payload.items)) return normalizeStatusOptions(payload.items);
  if (Array.isArray(payload.data)) return normalizeStatusOptions(payload.data);

  return [];
};

export const getApplicationStatuses = async (): Promise<string[]> => {
  const options = await getApplicationStatusOptions();
  return options.map((item) => item.name);
};
