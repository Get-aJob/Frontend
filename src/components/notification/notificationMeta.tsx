import clsx from 'clsx';
import { Bell, Briefcase, Megaphone, MessageSquare, Send } from 'lucide-react';

export function typeIcon(type: string) {
  const common = 'shrink-0 w-10 h-10 rounded-xl flex items-center justify-center';
  switch (type) {
    case 'COMMENT':
      return (
        <div className={clsx(common, 'bg-sky-50 text-sky-600')}>
          <MessageSquare size={20} strokeWidth={2} />
        </div>
      );
    case 'APPLICATION':
      return (
        <div className={clsx(common, 'bg-emerald-50 text-emerald-600')}>
          <Send size={20} strokeWidth={2} />
        </div>
      );
    case 'JOB':
      return (
        <div className={clsx(common, 'bg-amber-50 text-amber-600')}>
          <Briefcase size={20} strokeWidth={2} />
        </div>
      );
    case 'SYSTEM':
      return (
        <div className={clsx(common, 'bg-violet-50 text-violet-600')}>
          <Bell size={20} strokeWidth={2} />
        </div>
      );
    case 'ANNOUNCEMENT':
      return (
        <div className={clsx(common, 'bg-rose-50 text-rose-600')}>
          <Megaphone size={20} strokeWidth={2} />
        </div>
      );
    default:
      return (
        <div className={clsx(common, 'bg-gray-100 text-gray-600')}>
          <Bell size={20} strokeWidth={2} />
        </div>
      );
  }
}

export function typeLabel(type: string): string {
  const map: Record<string, string> = {
    COMMENT: '댓글',
    APPLICATION: '지원',
    JOB: '공고',
    SYSTEM: '시스템',
    ANNOUNCEMENT: '공지',
  };
  return map[type] ?? '알림';
}
