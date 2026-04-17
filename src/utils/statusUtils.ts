import { differenceInCalendarDays, isBefore, format, startOfDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { ApplicationRecord, JobPostingSummary } from '@/types/Status';

export type BadgeVariant = 'error' | 'warning' | 'success' | 'point' | 'default';

// 하드코딩된 문자열들을 유연하게 처리하기 위한 키워드 맵
const STATUS_KEYWORDS = {
  ALWAYS: ['상시', '항시', '365', '언제나'],
  ROLLING: ['채용시', '채용 시', '수시', '적격자', '홈페이지 지원', '마감 전'],
  CLOSED: ['마감됨', '종료', '만료', '마감한'],
};

// 로컬 시간대 오차 방지를 위해 날짜 문자열을 로컬 객체로 변환하는 헬퍼 함수
const parseLocalDate = (text: string): Date | null => {
  if (!text) return null;

  // YYYY-MM-DD 또는 YYYY-MM-DDTHH:mm:ss 형식 처리
  const datePart = text.split('T')[0];
  const dateSegments = datePart.split(/[-./]/);

  if (dateSegments.length === 3) {
    const [year, month, day] = dateSegments.map(Number);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return new Date(year, month - 1, day);
    }
  }

  const date = new Date(text);
  return isNaN(date.getTime()) ? null : date;
};

// 문자열을 분석하여 상태 카테고리를 반환하는 유틸리티
const getStatusCategory = (text: string): 'ALWAYS' | 'ROLLING' | 'CLOSED' | 'DATE' | 'UNKNOWN' => {
  if (!text) return 'UNKNOWN';
  if (STATUS_KEYWORDS.ALWAYS.some((k) => text.includes(k))) return 'ALWAYS';
  if (STATUS_KEYWORDS.ROLLING.some((k) => text.includes(k))) return 'ROLLING';
  if (STATUS_KEYWORDS.CLOSED.some((k) => text.includes(k))) return 'CLOSED';

  const date = parseLocalDate(text);
  return date === null ? 'UNKNOWN' : 'DATE';
};

export const isExpired = (deadline?: string): boolean => {
  if (!deadline) return false;
  const category = getStatusCategory(deadline);
  if (category === 'CLOSED') return true;
  if (category !== 'DATE') return false;

  const date = parseLocalDate(deadline);
  if (!date) return false;
  return isBefore(startOfDay(date), startOfDay(new Date()));
};

export const toDday = (deadline?: string): string => {
  if (!deadline) return '상시 채용';
  const category = getStatusCategory(deadline);

  switch (category) {
    case 'ALWAYS':
      return '상시 채용';
    case 'ROLLING':
      return '채용 시 마감';
    case 'CLOSED':
      return '공고 마감';
    case 'DATE': {
      const targetDate = parseLocalDate(deadline);
      if (!targetDate) return deadline;
      const diffDays = differenceInCalendarDays(startOfDay(targetDate), startOfDay(new Date()));
      if (diffDays === 0) return '오늘 마감';
      if (diffDays > 0) return `D-${diffDays}`;
      return '공고 마감';
    }
    default:
      // 정의되지 않은 긴 문구는 8자까지만 보여주고 자름
      return deadline.length > 8 ? `${deadline.slice(0, 8)}...` : deadline;
  }
};

export const formatFullDate = (deadline?: string): string => {
  if (!deadline) return '상시 채용';
  const category = getStatusCategory(deadline);

  // 특수 상태의 경우 상세 페이지용 문구 반환
  if (category === 'ALWAYS') return '상시 채용';
  if (category === 'ROLLING') return '채용 시 마감';

  // 날짜 형식인 경우
  if (category === 'DATE') {
    const target = parseLocalDate(deadline);
    if (!target) return deadline;
    const dateStr = format(target, 'yyyy.MM.dd');
    const isPast = isExpired(deadline);

    if (isPast) {
      return dateStr;
    }

    const weekDay = format(target, 'eee', { locale: ko });
    return `${dateStr} (${weekDay})`;
  }

  // 명시적으로 마감된 경우
  if (category === 'CLOSED') return '공고 마감';

  // 그 외 정해지지 않은 상세 문구는 그대로 보여줌
  return deadline;
};

export function ddayVariant(dday: string): BadgeVariant {
  if (dday.includes('공고 마감')) return 'error';
  if (dday === '오늘 마감') return 'warning';
  if (dday === '상시 채용' || dday === '채용 시 마감') return 'success';
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
// Date 객체를 로컬 시간 기준 YYYY-MM-DD 문자열로 변환 (타임존 오차 방지)
export const toLocalDateStr = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
