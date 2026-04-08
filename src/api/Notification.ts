import api from './Axios';
import type {
  IGetNotificationsQuery,
  IGetNotificationsResponse,
  IGetUnreadCountResponse,
  INotificationOnlyOneResponse,
  INotificationAllResponse,
} from '@/types/Notification';

export const fetchNotifications = async (
  query: IGetNotificationsQuery = {},
): Promise<IGetNotificationsResponse> => {
  const { data } = await api.get<IGetNotificationsResponse>('/notifications', {
    params: {
      cursor: query.cursor,
      limit: query.limit,
      unreadOnly: query.unreadOnly,
    },
  });
  return data;
};

export const fetchUnreadCount = async (): Promise<IGetUnreadCountResponse> => {
  const { data } = await api.get<IGetUnreadCountResponse>('/notifications/unread-count');
  return data;
};

export const fetchNotificationOnlyOne = async (
  notificationId: string,
): Promise<INotificationOnlyOneResponse> => {
  const { data } = await api.patch<INotificationOnlyOneResponse>(
    `/notifications/${notificationId}/read`,
  );
  return data;
};

export const fetchAllNotification = async (): Promise<INotificationAllResponse> => {
  const { data } = await api.post<INotificationAllResponse>('/notifications/read-all');
  return data;
};
