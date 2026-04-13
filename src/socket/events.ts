export const SOCKET_EVENT = {
  SERVER: {
    NOTIFICATION_NEW: 'notification:new',
    NOTIFICATION_READ: 'notification:read',
    SYSTEM_PONG: 'system:pong',
  },
  CLIENT: {
    PING: 'ping',
  },
} as const;
export type ServerSocketEvent = (typeof SOCKET_EVENT.SERVER)[keyof typeof SOCKET_EVENT.SERVER];
export type ClientSocketEvent = (typeof SOCKET_EVENT.CLIENT)[keyof typeof SOCKET_EVENT.CLIENT];

export interface INotificationNewEventPayload {
  id?: string | number;
  message?: string;
  readAt?: string | null;
  read_at?: string | null;
}
