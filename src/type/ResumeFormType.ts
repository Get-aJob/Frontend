export type AdditionalInfoType = '수상' | '자격증' | '활동' | undefined;
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

export interface WorkHistory {
  companyName: string;
  position: string;
  period: Period;
  description: string;
}

export interface Education {
  name: string;
  period: Period;
  description: string;
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
  url: string;
}

export interface ResumeFormInputs {
  title: string;
  profile: string;
  workHistory: WorkHistory[];
  education: Education[];
  skill: string;
  additionalInfo: AdditionalInfo[];
  language: Language[];
  portfolio: Portfolio[];
}
