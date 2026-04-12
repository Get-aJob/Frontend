import clsx from 'clsx';
import type { INotificationItem } from '@/types/Notification';
import { formatRelativeTime } from '@/utils/notification';
import { typeIcon, typeLabel } from './notificationMeta';

interface NotificationListProps {
  items: INotificationItem[];
  onMarkRead: (id: string) => void;
}

function NotificationList({ items, onMarkRead }: NotificationListProps) {
  return (
    <ul className="flex flex-col gap-3 list-none p-0 m-0">
      {items.map((item) => {
        const unread = item.readAt === null;

        return (
          <li key={item.id}>
            <article
              className={clsx(
                'group rounded-2xl border transition-shadow',
                unread
                  ? 'border-btn-point/25 bg-white shadow-md ring-1 ring-btn-point/10'
                  : 'border-border-light bg-white/80 shadow-sm hover:shadow-md',
              )}
            >
              <div className="flex gap-4 p-4 sm:p-5">
                {typeIcon(item.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 gap-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      {typeLabel(item.type)}
                    </span>
                    {unread && (
                      <span className="text-[11px] font-bold text-btn-point bg-btn-point/10 px-2 py-0.5 rounded-full">
                        NEW
                      </span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto tabular-nums">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>

                  <h2
                    className={clsx(
                      'text-base mt-1',
                      unread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700',
                    )}
                  >
                    {item.title}
                  </h2>

                  <p className="text-sm text-gray-600 mt-1 leading-relaxed line-clamp-2">{item.body}</p>

                  {unread && (
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => onMarkRead(item.id)}
                        className={clsx(
                          'inline-flex items-center justify-center cursor-pointer select-none',
                          'rounded-xl border border-border-light bg-white px-3.5 py-2',
                          'text-sm font-semibold text-gray-700 shadow-sm',
                          'transition-colors hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100',
                        )}
                      >
                        읽음 처리
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}

export default NotificationList;
