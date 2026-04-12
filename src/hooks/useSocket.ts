// 사용 예시 — 단일 연결은 Layout 권장. 이 훅을 쓸 경우에도 subscribe + { notification } 페이로드에 맞춤.
import { useEffect } from 'react';
import { createNotificationSocket } from '@/socket/SocketClient';
import { SOCKET_EVENT } from '@/socket/events';
import { mapNotificationToItem, type INotificationItem } from '@/types/Notification';
import { useAuthStore } from '@/store/useAuthStore';

export function useNotificationSocket(onNewNotification: (item: INotificationItem) => void) {
  const userId = useAuthStore((s) => s.userInfo?.id ?? s.user?.id);

  useEffect(() => {
    const socket = createNotificationSocket();

    const subscribe = () => {
      if (userId != null && userId !== '') {
        socket.emit(SOCKET_EVENT.CLIENT.NOTIFICATION_SUBSCRIBE, userId);
      }
    };

    socket.on('connect', subscribe);

    socket.on(SOCKET_EVENT.SERVER.NOTIFICATION_NEW, (payload) => {
      const n = payload?.notification;
      if (!n) return;
      onNewNotification(mapNotificationToItem(n));
    });

    socket.on(SOCKET_EVENT.SERVER.NOTIFICATION_READ, ({ id, read_at }) => {
      console.log('[socket] notification:read', id, read_at);
    });

    socket.on(SOCKET_EVENT.SERVER.SYSTEM_PONG, (payload) => {
      console.log('[socket] system:pong', payload);
    });

    socket.connect();
    if (socket.connected) subscribe();

    return () => {
      socket.off('connect', subscribe);
      socket.off(SOCKET_EVENT.SERVER.NOTIFICATION_NEW);
      socket.off(SOCKET_EVENT.SERVER.NOTIFICATION_READ);
      socket.off(SOCKET_EVENT.SERVER.SYSTEM_PONG);
      socket.disconnect();
    };
  }, [onNewNotification, userId]);
}
