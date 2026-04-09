import type { GetResumeById, ResumeFormInputs } from '@/types/ResumeFormType';

export const dataToResume = (data: GetResumeById) => {
  const resume: ResumeFormInputs = {
    title: data.title,
    profile: data.content.profile,
    experience: data.content.experience.map((e) => ({ ...e, isCurrent: !e.period.endDate })),
    education: data.content.education.map((e) => ({ ...e, isCurrent: !e.period.endDate })),
    skill: data.content.skill,
    additionalInfo: data.content.additionalInfo,
    language: data.content.language,
    portfolio: data.content.portfolio.map((p) => ({
      name: p.name,
      url: p.url,
      fileUrl: p.fileUrl,
      file: null,
      type: p.fileUrl ? 'file' : 'url',
    })),
  };
  return resume;
};
