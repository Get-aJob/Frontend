import type { ApplicationRecord, JobPostingSummary } from '@/types/Status';

export type BadgeVariant = 'error' | 'warning' | 'success' | 'point' | 'default';

export const toDday = (deadline?: string): string => {
  if (!deadline || deadline === '상시채용') return '상시채용';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(deadline);
  if (isNaN(target.getTime())) return deadline;

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'D-Day';
  if (diffDays > 0) return `D-${diffDays}`;
  return `마감 (D+${Math.abs(diffDays)})`;
};

export function ddayVariant(dday: string): BadgeVariant {
  if (!dday || dday.includes('마감') || dday.includes('+')) return 'error';
  if (dday === 'D-Day' || dday === '오늘마감') return 'warning';
  if (dday === '상시채용') return 'success';
  return 'point';
}

export function toApplicationItem(app: ApplicationRecord) {
  const job = app.jobPostings as JobPostingSummary & { deadline?: string };

  const appData = app as ApplicationRecord & { statusName?: string };

  return {
    id: app.id,
    company: job?.companyName || '회사명 미상',
    role: job?.title || '공고 제목 없음',
    statusName: appData.statusName || '지원 완료',
    deadline: job?.deadline ? job.deadline.split('T')[0] : '-',
    dday: toDday(job?.deadline),
    appliedAt: app.appliedAt ? app.appliedAt.split('T')[0] : '-',
  };
}
