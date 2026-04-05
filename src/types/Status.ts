// 백엔드 job_postings 테이블 조인 결과
export interface JobPostingSummary {
  id: string;
  title: string;
  companyName: string;
}

export interface ApplicationStatus {
  id: number | string;
  displayName: string;
}

export interface ApplicationRecord {
  id: string;
  userId: string;
  jobPostingId: string;
  statusId: number | string;
  appliedAt: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  jobPostings: JobPostingSummary;
  applicationStatuses?: ApplicationStatus;
}

export interface CreateApplicationPayload {
  jobPostingId: string;
  statusId: number | string;
  appliedAt: string;
  notes?: string;
}

export interface UpdateApplicationPayload {
  statusId?: number | string;
  notes?: string;
}
