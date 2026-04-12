export interface INotification {
  id: string;
  type: string;
  title: string;
  body: string;
  payload: Record<string, unknown> | null;
  created_at: string;
  read_at: string | null;
  sent_at?: string | null;
}

export interface INotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  payload?: {
    href?: string;
    [key: string]: unknown;
  };
  createdAt: string;
  readAt: string | null;
  sentAt?: string | null;
}

export interface IGetNotificationsQuery {
  cursor?: string;
  limit?: number;
  unreadOnly?: boolean;
}

export interface IGetNotificationsResponse {
  notifications: INotification[];
  nextCursor: string | null;
}

export function mapNotificationToItem(backData: INotification): INotificationItem {
  const payload = backData.payload ?? {};
  return {
    id: backData.id,
    type: backData.type,
    title: backData.title,
    body: backData.body,
    payload: Object.keys(payload).length > 0 ? payload : undefined,
    createdAt: backData.created_at,
    readAt: backData.read_at,
    sentAt: backData.sent_at ?? undefined,
  };
}

export interface IGetUnreadCountResponse {
  unreadCount: number;
}

// 단건 읽음
export interface INotificationOnlyOneResponse {
  success: boolean;
  notification?: INotification;
}
// 일괄 읽음
export interface INotificationAllResponse {
  success: boolean;
  updatedCount: number;
}

// 소켓 통신 관련
export interface INotificationReadEvent {
  id: string;
  read_at: string | null;
}
export interface ISystemPongEvent {
  at: string;
}

/** 서버 → 클라이언트: notification:new (목록 API와 동일 스네이크 케이스 단건을 감쌈) */
export interface INotificationNewEventPayload {
  notification: INotification;
}

export interface ISocketServerToClientEvents {
  'notification:new': (payload: INotificationNewEventPayload) => void;
  'notification:read': (payload: INotificationReadEvent) => void;
  'system:pong': (payload: ISystemPongEvent) => void;
}
export interface ISocketClientToServerEvents {
  ping: (payload: { from: string; at: number }) => void;
  'notification:subscribe': (userId: string | number) => void;
}
