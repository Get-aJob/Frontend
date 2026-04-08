import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X } from 'lucide-react';

import EmptyState from '@/components/common/UI/EmptyState';
import NotificationHeader from '@/components/notification/NotificationHeader';
import NotificationList from '@/components/notification/NotificationList';
import {
  fetchNotifications,
  fetchNotificationOnlyOne,
  fetchAllNotification,
} from '@/api/Notification';
import { mapNotificationToItem, type INotificationItem } from '@/types/Notification';
import { useNotificationSocket } from '@/hooks/useSocket';
import { useNotificationStore } from '@/store/useNotificationStore';

function Notification() {
  const navigate = useNavigate();

  const [items, setItems] = useState<INotificationItem[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [initialLoadError, setInitialLoadError] = useState<string | null>(null);

  const [unreadOnly, setUnreadOnly] = useState(false);
  const [loginBannerDismissed, setLoginBannerDismissed] = useState(false);

  const unreadCount = useMemo(() => items.filter((n) => n.readAt === null).length, [items]);
  const setGlobalUnreadCount = useNotificationStore((state) => state.setUnreadCount);

  useEffect(() => {
    setGlobalUnreadCount(unreadCount);
  }, [unreadCount, setGlobalUnreadCount]);

  // 실시간 알림 수신 -> 최상단 병합 + 중복 제거
  const handleSocketNewNotification = useCallback((newItem: INotificationItem) => {
    setItems((prev) => {
      if (prev.some((item) => item.id === newItem.id)) return prev;
      return [newItem, ...prev];
    });
  }, []);

  // 추가
  useNotificationSocket(handleSocketNewNotification);

  const visibleItems = useMemo(() => {
    const sorted = [...items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return unreadOnly ? sorted.filter((n) => n.readAt === null) : sorted;
  }, [items, unreadOnly]);

  const loadInitialNotifications = useCallback(async () => {
    try {
      setInitialLoadError(null);
      setIsInitialLoading(true);

      const res = await fetchNotifications({
        limit: 20,
        unreadOnly: false,
      });

      setItems(res.notifications.map(mapNotificationToItem));
    } catch (error) {
      console.error('알림 목록 초기 로드 실패:', error);
      setInitialLoadError('알림 목록을 불러오지 못했습니다.');
      setItems([]);
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInitialNotifications();
  }, [loadInitialNotifications]);

  const markRead = useCallback(
    async (id: string) => {
      try {
        const res = await fetchNotificationOnlyOne(id);
        if (res.success && res.notification) {
          const updated = mapNotificationToItem(res.notification);
          setItems((prev) => prev.map((n) => (n.id === id ? updated : n)));
          return;
        }
        const list = await fetchNotifications({ limit: 20, unreadOnly: false });
        setItems(list.notifications.map(mapNotificationToItem));
      } catch (e) {
        console.error('읽음 처리 실패:', e);
        alert('읽음 처리에 실패했습니다.');
      }
    },
    [],
  );

  const markAllRead = useCallback(async () => {
    try {
      const res = await fetchAllNotification();
      if (!res.success) {
        alert('모두 읽음 처리에 실패했습니다.');
        return;
      }
      const list = await fetchNotifications({ limit: 20, unreadOnly: false });
      setItems(list.notifications.map(mapNotificationToItem));
    } catch (e) {
      console.error('모두 읽음 실패:', e);
      alert('모두 읽음 처리에 실패했습니다.');
    }
  }, []);

  const handleRowNavigate = useCallback(
    async (item: INotificationItem) => {
      const href = item.payload?.href;
      if (typeof href !== 'string' || !href.trim()) return;
      if (item.readAt === null) {
        await markRead(item.id);
      }
      navigate(href.trim());
    },
    [navigate, markRead],
  );

  const showLoginStyleBanner = unreadCount > 0 && !loginBannerDismissed;

  return (
    <div className="flex flex-col gap-8">
      <NotificationHeader
        unreadOnly={unreadOnly}
        unreadCount={unreadCount}
        onToggleUnreadOnly={setUnreadOnly}
        onMarkAllRead={markAllRead}
      />

      {showLoginStyleBanner && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 shadow-sm"
        >
          <div className="mt-0.5 text-amber-600">
            <Bell size={20} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-amber-950 text-sm">확인하지 않은 알림이 있습니다</p>
            <p className="text-sm text-amber-900/80 mt-0.5">
              읽지 않은 알림이 <span className="font-bold tabular-nums">{unreadCount}</span>개
              있습니다. 아래 목록에서 확인해 주세요.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setLoginBannerDismissed(true)}
            className="p-1 rounded-lg text-amber-800/70 hover:bg-amber-100/80 transition-colors"
            aria-label="배너 닫기"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {isInitialLoading ? (
        <div className="flex items-center justify-center py-24 bg-white rounded-[32px] border border-border-light shadow-sm">
          <p className="text-gray-500 text-sm">알림을 불러오는 중입니다...</p>
        </div>
      ) : initialLoadError ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 bg-white rounded-[32px] border border-border-light shadow-sm">
          <p className="text-red-500 text-sm">{initialLoadError}</p>
          <button
            type="button"
            onClick={loadInitialNotifications}
            className="px-4 py-2 rounded-full border border-border-light text-sm font-medium hover:bg-gray-50"
          >
            다시 시도
          </button>
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="flex items-center justify-center py-24 bg-white rounded-[32px] border border-border-light shadow-sm">
          <EmptyState
            icon={<Bell size={48} className="text-gray-300" />}
            title={unreadOnly ? '미읽음 알림이 없습니다' : '알림이 없습니다'}
            description={
              unreadOnly
                ? '모든 알림을 확인하셨습니다.\n“전체” 탭에서 지난 알림을 볼 수 있습니다.'
                : '새 소식이 생기면 이곳에 표시됩니다.'
            }
          />
        </div>
      ) : (
        <NotificationList items={visibleItems} onMove={handleRowNavigate} onMarkRead={markRead} />
      )}
    </div>
  );
}

export default Notification;