export interface BackendJob {
  id: string | number;
  title: string;
  company_name?: string;
  companyName?: string;
  source_type?: string;
  sourceType?: string;
  source_url?: string;
  sourceUrl?: string;
  company_logo?: string;
  companyLogo?: string;
  location?: string;
  experience?: string;
  deadline?: string;
  deadline_text?: string;
  deadlineText?: string;
  external_id?: string;
  externalId?: string;
  content?: string | Record<string, unknown>;
  description?: string;
  source_site_name?: string;
  sourceSiteName?: string;
  created_at?: string;
  createdAt?: string;
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
  commentCount?: number;
  viewCount?: number;
}

export interface PostingResponse {
  jobs: BackendJob[];
  totalCount?: number;
  sourceSites?: string[];
}

export interface DirectJobRequest {
  title: string;
  companyName: string;
  location?: string;
  experience?: string;
  companyLogo?: string;
  deadline?: string | null;
  deadlineText?: string | null;
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

export interface ParsedJobData {
  title?: string;
  companyName?: string;
  companyLogo?: string;
  location?: string;
  experience?: string;
  sourceUrl?: string;
  externalId?: string;
  deadline?: string;
  deadlineText?: string;
  content?: {
    requirements?: string;
    preferred?: string;
    description?: string;
    [key: string]: unknown;
  };
}
