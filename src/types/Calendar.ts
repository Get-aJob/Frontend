export type ViewType = 'month' | 'week' | 'day';

export interface ScheduleEvent {
  jobPostingId: string;
  type: 'job_post';
  eventType: 'deadline' | 'applied';
  title: string;
  companyName: string;
  date: string;
  isApplied: boolean;
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
