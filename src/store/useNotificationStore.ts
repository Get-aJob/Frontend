import { create } from 'zustand';
import { fetchUnreadCount } from '@/api/Notification';

interface INotificationState {
  unreadCount: number;
  socketEventVersion: number;
  setUnreadCount: (count: number) => void;
  increaseUnreadCount: (delta?: number) => void;
  notifySocketNew: () => void;
  resetUnreadCount: () => void;
  syncUnreadCount: () => Promise<void>;
}

export const useNotificationStore = create<INotificationState>((set, get) => ({
  unreadCount: 0,
  socketEventVersion: 0,
  setUnreadCount: (count) => {
    set({ unreadCount: Math.max(0, count) });
  },
  increaseUnreadCount: (delta = 1) => {
    const next = get().unreadCount + delta;
    set({ unreadCount: Math.max(0, next) });
  },
  notifySocketNew: () => {
    const nextVersion = get().socketEventVersion + 1;
    set({ socketEventVersion: nextVersion });
  },
  resetUnreadCount: () => {
    set({ unreadCount: 0, socketEventVersion: 0 });
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
