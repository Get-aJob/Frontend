import type { ApplicationRecord } from '@/types/Status';

export function toDday(deadline: string | undefined) {
  if (!deadline) return '-';
  const target = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff === 0 ? 'D-Day' : diff > 0 ? `D-${diff}` : '마감';
}

export function ddayVariant(dday: string): 'error' | 'warning' | 'success' | 'default' {
  if (dday === '마감' || dday === 'D-Day' || dday.startsWith('D-1') || dday.startsWith('D-2'))
    return 'error';
  if (dday.startsWith('D-')) return 'warning';
  if (dday === '-') return 'default';
  return 'success';
}

export function toApplicationItem(app: ApplicationRecord) {
  return {
    id: app.id,
    company: app.jobPostings?.companyName || '알 수 없는 회사',
    role: app.jobPostings?.title || '직무 미지정',
    statusName: app.statusName || '지원 완료',
    deadline: app.jobPostings?.deadline?.split('T')[0] || '-',
    dday: toDday(app.jobPostings?.deadline),
    appliedAt: app.appliedAt?.split('T')[0] || '-',
  };
}
