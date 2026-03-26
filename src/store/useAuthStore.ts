import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserInfo {
  name: string;
  email: string;
}

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  userInfo: UserInfo | null;
  login: (token: string, userInfo: UserInfo) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      token: null,
      userInfo: null,
      login: (token, userInfo) => set({ isLoggedIn: true, token, userInfo }),
      logout: () => set({ isLoggedIn: false, token: null, userInfo: null }),
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
