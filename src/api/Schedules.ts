import api from './Axios';
import type { GetSchedulesParams, GetSchedulesResponse } from '@/types/Calendar';

export const getSchedules = async (params: GetSchedulesParams) => {
  const response = await api.get<GetSchedulesResponse>('/schedules', {
    params,
  });
  return response.data;
};
