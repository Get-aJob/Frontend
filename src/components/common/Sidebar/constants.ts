import { PATH } from '@/router/Path';

export interface NavItemType {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
  badgeColor?: string;
}

export interface NavSectionType {
  title: string;
  items: NavItemType[];
}

export const NAV_SECTIONS: NavSectionType[] = [
  {
    title: '메인',
    items: [
      { id: 'nav-calendar', label: '캘린더', icon: '📅', path: PATH.CALENDAR },
      {
        id: 'nav-kanban',
        label: '지원 현황',
        icon: '📋',
        path: PATH.STATUS,
        badge: 12,
        badgeColor: 'bg-[#4f46e5]',
      },
      { id: 'nav-jobboard', label: '전체 공고', icon: '🔍', path: PATH.POSTING },
      { id: 'nav-stats', label: '통계 분석', icon: '📊', path: PATH.DASHBOARD },
    ],
  },
  {
    title: '관리',
    items: [
      { id: 'nav-resume', label: '이력서 관리', icon: '🗂️', path: PATH.RESUME },
      {
        id: 'nav-scrap',
        label: '공고 스크랩',
        icon: '🔖',
        path: PATH.SCRAP,
        badge: 5,
        badgeColor: 'bg-[#f59e0b]',
      },
    ],
  },
  {
    title: '기타',
    items: [
      {
        id: 'nav-noti',
        label: '알림',
        icon: '🔔',
        path: PATH.NOTIFICATION,
        badge: 3,
        badgeColor: 'bg-[#f43f5e]',
      },
      { id: 'nav-settings', label: '계정 설정', icon: '⚙️', path: PATH.SETTINGS },
    ],
  },
];
