// src/socket/events.ts
export const SOCKET_EVENT = {
  SERVER: {
    NOTIFICATION_NEW: 'notification:new',
    NOTIFICATION_READ: 'notification:read',
    SYSTEM_PONG: 'system:pong',
  },
  CLIENT: {
    PING: 'ping',
    /** 로그인 userId 전달 → 서버에서 user:${userId} 룸 join */
    NOTIFICATION_SUBSCRIBE: 'notification:subscribe',
  },
} as const;
export type ServerSocketEvent = (typeof SOCKET_EVENT.SERVER)[keyof typeof SOCKET_EVENT.SERVER];
export type ClientSocketEvent = (typeof SOCKET_EVENT.CLIENT)[keyof typeof SOCKET_EVENT.CLIENT];
