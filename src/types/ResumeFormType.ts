export type AdditionalInfoType = '수상' | '자격증' | '활동' | undefined;
export type uploadType = 'file' | 'url';
export type LanguageLevelType =
  | '유창함'
  | '고급 비즈니스 레벨'
  | '비즈니스 레벨'
  | '일상 회화'
  | undefined;

export interface Period {
  startDate: Date | null;
  endDate: Date | null;
}

export interface Experience {
  name: string;
  position: string;
  period: Period;
  description: string;
  isCurrent: boolean; // ui를 위한 임시 속성
}

export interface Education {
  name: string;
  period: Period;
  description: string;
  isCurrent: boolean; // ui를 위한 임시 속성
}

export interface AdditionalInfo {
  name: string;
  date: Date | null;
  type: AdditionalInfoType;
  description: string;
}

export interface Test {
  testName: string;
  date: Date | null;
  score: string;
}

export interface Language {
  name: string;
  level: LanguageLevelType;
  test: Test[];
}

export interface Portfolio {
  name: string;
  url?: string;
  file: File | null;
  type: uploadType; // ui를 위한 임시 속성
}

export interface ResumeFormInputs {
  title: string;
  profile: string;
  experience: Experience[];
  education: Education[];
  skill: string;
  additionalInfo: AdditionalInfo[];
  language: Language[];
  portfolio: Portfolio[];
}

interface ResumeFormPayload {
  profile: string;
  experience: Omit<Experience, 'isCurrent'>[];
  education: Omit<Education, 'isCurrent'>[];
  skill: string;
  additionalInfo: AdditionalInfo[];
  language: Language[];
  portfolio: Omit<Portfolio, 'type'>[];
}

export interface ResumeFormData {
  title: string;
  resume: ResumeFormPayload;
}

export interface ResumeInfo {
  id: string;
  title: string;
  createdAt: string;
}

export interface GetResumeById {
  id: string;
  title: string;
  content: ResumeFormPayload;
  createdAt: string;
}
