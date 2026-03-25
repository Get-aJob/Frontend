import api from './Axios';
import type { LoginField, JoinField } from '@/types/Auth';

export const loginApi = async (data: LoginField) => {
  const response = await api.post('/auth/login', data);
  console.log(response.data);
  return response.data;
};

export const joinApi = async (data: JoinField) => {
  const response = await api.post('/auth/join', data);
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const deleteAccountApi = async () => {
  const response = await api.delete('/users/me');
  return response.data;
};
