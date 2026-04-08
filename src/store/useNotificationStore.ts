import { create } from 'zustand';
import { fetchUnreadCount } from '@/api/Notification';

interface INotificationState {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  increaseUnreadCount: (delta?: number) => void;
  resetUnreadCount: () => void;
  syncUnreadCount: () => Promise<void>;
}

export const useNotificationStore = create<INotificationState>((set, get) => ({
  unreadCount: 0,
  setUnreadCount: (count) => {
    set({ unreadCount: Math.max(0, count) });
  },
  increaseUnreadCount: (delta = 1) => {
    const next = get().unreadCount + delta;
    set({ unreadCount: Math.max(0, next) });
  },
  resetUnreadCount: () => {
    set({ unreadCount: 0 });
  },
  syncUnreadCount: async () => {
    try {
      const res = await fetchUnreadCount();
      set({ unreadCount: Math.max(0, res.unreadCount ?? 0) });
    } catch (error) {
      console.error('미읽음 개수 동기화 실패:', error);
    }
  },
}));
