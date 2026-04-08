import clsx from 'clsx';
import { CheckCheck } from 'lucide-react';

interface NotificationHeaderProps {
  unreadOnly: boolean;
  unreadCount: number;
  onToggleUnreadOnly: (value: boolean) => void;
  onMarkAllRead: () => void;
}

function NotificationHeader({
  unreadOnly,
  unreadCount,
  onToggleUnreadOnly,
  onMarkAllRead,
}: NotificationHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium text-btn-point tracking-widest uppercase mb-1">NOTIFICATION</p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">알림</h1>
        <p className="text-sm text-gray-500 mt-1">받은 알림을 확인하고 읽음 처리할 수 있습니다.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-full border border-border-light bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => onToggleUnreadOnly(false)}
            className={clsx(
              'px-4 py-1.5 text-sm font-medium rounded-full transition-colors',
              !unreadOnly ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50',
            )}
          >
            전체
          </button>
          <button
            type="button"
            onClick={() => onToggleUnreadOnly(true)}
            className={clsx(
              'px-4 py-1.5 text-sm font-medium rounded-full transition-colors',
              unreadOnly ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50',
            )}
          >
            미읽음
            {unreadCount > 0 && (
              <span className="ml-1.5 tabular-nums text-xs opacity-90">({unreadCount})</span>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
          className={clsx(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-colors',
            unreadCount === 0
              ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
              : 'border-border-light bg-white text-gray-800 hover:bg-gray-50 shadow-sm',
          )}
        >
          <CheckCheck size={18} className="text-btn-point" />
          모두 읽음
        </button>
      </div>
    </header>
  );
}

export default NotificationHeader;
