import api from './Axios';
import type { LoginField, JoinField } from '@/types/Auth';

export const loginApi = async (data: LoginField) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const meApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const googleCredentialLoginApi = async (credential: string) => {
  const response = await api.post('/auth/google/credential', { credential });
  return response.data;
};

export const joinApi = async (data: JoinField) => {
  const formData = new FormData();
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('name', data.name);

  if (data.profileImage) {
    formData.append('file', data.profileImage);
  }

  const response = await api.post('/auth/join', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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

export const uploadProfileImageApi = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/auth/join', formData);
  return response.data;
};

export const deleteProfileImageApi = async () => {
  const response = await api.delete('/users/me/image');
  return response.data;
};

export const requestPasswordResetApi = async (data: { email: string; name: string }) => {
  const response = await api.post('/auth/password/reset', data);
  return response.data;
};

export const confirmPasswordResetApi = async (data: { reset_token: string; password: string }) => {
  const response = await api.put('/auth/password/reset', data);
  return response.data;
};
