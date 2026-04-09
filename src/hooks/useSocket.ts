// 사용 예시 (Notification.tsx 또는 useSocket.ts)
import { useEffect } from 'react';
import { createNotificationSocket } from '@/socket/SocketClient';
import { SOCKET_EVENT } from '@/socket/events';
import { mapNotificationToItem, type INotificationItem } from '@/types/Notification';

export function useNotificationSocket(onNewNotification: (item: INotificationItem) => void) {
  useEffect(() => {
    const socket = createNotificationSocket();

    socket.on(SOCKET_EVENT.SERVER.NOTIFICATION_NEW, (payload) => {
      // REST 단건 스키마(INotification)와 동일 payload 계약
      onNewNotification(mapNotificationToItem(payload));
    });

    socket.on(SOCKET_EVENT.SERVER.NOTIFICATION_READ, ({ id, read_at }) => {
      console.log('[socket] notification:read', id, read_at);
    });

    socket.on(SOCKET_EVENT.SERVER.SYSTEM_PONG, (payload) => {
      console.log('[socket] system:pong', payload);
    });

    socket.connect();
    // socket.emit(SOCKET_EVENT.CLIENT.PING, { from: 'frontend', at: Date.now() });

    return () => {
      socket.off(SOCKET_EVENT.SERVER.NOTIFICATION_NEW);
      socket.off(SOCKET_EVENT.SERVER.NOTIFICATION_READ);
      socket.off(SOCKET_EVENT.SERVER.SYSTEM_PONG);
      socket.disconnect();
    };
  }, [onNewNotification]);
}
