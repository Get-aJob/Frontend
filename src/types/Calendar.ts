export type ViewType = 'month' | 'week' | 'day';
export type EventFilterType = 'all' | 'manual' | 'auto' | 'applied';

export interface ScheduleEvent {
  jobPostingId: string;
  type: 'job_post';
  eventType: 'deadline' | 'applied';
  title: string;
  companyName: string;
  sourceType?: string;
  companyLogo?: string;
  date: string;
  isApplied: boolean;
  statusName?: string;
}

export interface GetSchedulesParams {
  startDate: string;
  endDate: string;
  isApplied?: boolean;
}

export interface GetSchedulesResponse {
  schedules: {
    events: ScheduleEvent[];
  };
}
