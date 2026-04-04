import React from 'react';
import { PATH } from '@/router/Path';
import {
  Calendar,
  KanbanSquare,
  Briefcase,
  MessageSquareText,
  BarChart3,
  FileText,
  Bookmark,
  Bell,
  Settings,
} from 'lucide-react';

export interface NavItemType {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  badgeVariant?: 'point' | 'success' | 'error' | 'warning' | 'default';
}

export interface NavSectionType {
  title: string;
  items: NavItemType[];
}

export const NAV_SECTIONS: NavSectionType[] = [
  {
    title: '메인',
    items: [
      { id: 'nav-calendar', label: '캘린더', icon: <Calendar size={18} />, path: PATH.ROOT },
      {
        id: 'nav-kanban',
        label: '지원 현황',
        icon: <KanbanSquare size={18} />,
        path: PATH.STATUS,
        badgeVariant: 'point',
      },
      { id: 'nav-jobboard', label: '전체 공고', icon: <Briefcase size={18} />, path: PATH.POSTING },
      {
        id: 'nav-jobboardfeed',
        label: '공고 댓글',
        icon: <MessageSquareText size={18} />,
        path: PATH.POSTING_FEED,
      },
      { id: 'nav-stats', label: '통계 분석', icon: <BarChart3 size={18} />, path: PATH.DASHBOARD },
    ],
  },
  {
    title: '관리',
    items: [
      { id: 'nav-resume', label: '이력서 관리', icon: <FileText size={18} />, path: PATH.RESUME },
      {
        id: 'nav-scrap',
        label: '공고 스크랩',
        icon: <Bookmark size={18} />,
        path: PATH.SCRAP,
        badgeVariant: 'warning',
      },
    ],
  },
  {
    title: '기타',
    items: [
      {
        id: 'nav-noti',
        label: '알림',
        icon: <Bell size={18} />,
        path: PATH.NOTIFICATION,
        badgeVariant: 'error',
      },
      { id: 'nav-settings', label: '계정 설정', icon: <Settings size={18} />, path: PATH.SETTINGS },
    ],
  },
];
