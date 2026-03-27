import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface UserInfo {
  id?: number;
  name: string;
  email: string;
  profile_image_url?: string | null;
}

interface AuthState {
  isLoggedIn: boolean;
  userInfo: UserInfo | null;
  login: (userInfo: UserInfo) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      userInfo: null,
      login: (userInfo) => set({ isLoggedIn: true, userInfo }),
      logout: () => set({ isLoggedIn: false, userInfo: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userInfo: state.userInfo,
      }),
    },
  ),
);
