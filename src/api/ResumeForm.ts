import type { GetResumeById, ResumeFormData, ResumeInfo } from '@/types/ResumeFormType';
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
