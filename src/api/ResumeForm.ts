import type {
  GetResumeById,
  ResumeFormData,
  ResumeInfo,
  UploadResult,
} from '@/types/ResumeFormType';
import api from './Axios';

export const createResume = async (data: ResumeFormData): Promise<ResumeInfo> => {
  const response = await api.post('/resumes', data);
  return response.data;
};

export const getAllResume = async (): Promise<ResumeInfo[]> => {
  const response = await api.get('/resumes');
  return response.data;
};

export const getResumeById = async (resumeId: string): Promise<GetResumeById> => {
  const response = await api.get(`/resumes/${resumeId}`);
  return response.data;
};

export const updateResume = async (resumeId: string, data: ResumeFormData) => {
  const response = await api.patch(`/resumes/${resumeId}`, data);
  return response.data;
};

export const deleteResume = async (resumeId: string) => {
  const response = await api.delete(`/resumes/${resumeId}`);
  return response.data;
};

export const duplicateResume = async (resumeId: string) => {
  const response = await api.post(`/resumes/${resumeId}/duplicate`);
  return response.data;
};

export const uploadPortfolio = async (file: File): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/portfolios/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
