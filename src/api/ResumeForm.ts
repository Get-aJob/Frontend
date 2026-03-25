import type { ResumeFormInputs } from '@/types/ResumeFormType';
import api from './Axios';

export const submitApi = async (data: ResumeFormInputs) => {
  const response = await api.post('/resumes', data);
  return response.data;
};
