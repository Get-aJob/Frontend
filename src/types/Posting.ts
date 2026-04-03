export interface BackendJob {
  id: string | number;
  title: string;
  company_name: string;
  source_type: string;
  source_url?: string;
  company_logo?: string;
  location?: string;
  experience?: string;
  deadline?: string;
  deadline_text?: string;
  external_id?: string;
  content?: string;
  source_site_name?: string;
  created_at?: string;
}

export interface JobPosting {
  id: number | string;
  companyName: string;
  companyLogo?: string;
  title: string;
  url?: string;
  site: string;
  location: string;
  experienceLevel?: string;
  deadline: string;
  isScrapped?: boolean;
  sourceType?: string;
  externalId?: string;
  description?: string;
}

export interface PostingResponse {
  jobs: BackendJob[];
  totalCount: number;
}

export interface DirectJobRequest {
  title: string;
  companyName: string;
  location?: string;
  experience?: string;
  companyLogo?: string;
  deadline?: string;
  deadlineText?: string;
  description?: string;
  sourceUrl?: string;
}

export interface ManualSaveRequest {
  title: string;
  companyName: string;
  externalId: string;
  sourceUrl: string;
  companyLogo?: string;
  location?: string;
  experience?: string;
  deadline?: string;
  deadlineText?: string;
  content?: Record<string, unknown> | string;
}
