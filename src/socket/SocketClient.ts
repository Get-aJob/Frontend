import { io, type Socket } from 'socket.io-client';
import type {
  ISocketClientToServerEvents,
  ISocketServerToClientEvents,
} from '@/types/Notification';

const url = import.meta.env.VITE_API_URL;

export type NotificationSocket = Socket<ISocketServerToClientEvents, ISocketClientToServerEvents>;

export function createNotificationSocket(): NotificationSocket {
  return io(url, {
    path: '/socket.io', // 백엔드 설정과 반드시 동일
    transports: ['websocket', 'polling'],
    autoConnect: false,
    withCredentials: true,
  });
}
