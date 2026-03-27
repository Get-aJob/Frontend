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
}

export interface PostingResponse {
  jobs: BackendJob[];
}
