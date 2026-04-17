import { useQuery } from '@tanstack/react-query';
import { getSchedules } from '@/api/Schedules';
import type { GetSchedulesParams } from '@/types/Calendar';

export const useSchedules = (params: GetSchedulesParams) => {
  return useQuery({
    queryKey: ['schedules', params.startDate, params.endDate],
    queryFn: () => getSchedules(params),
    staleTime: 5 * 60 * 1000,
  });
};
