import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// 1. 공통으로 사용할 유저 정보 인터페이스
export interface UserInfo {
  id?: number | string;
  name: string;
  email: string;
  profile_image_url?: string | null;
  provider?: string;
}

// 2. AuthState 인터페이스 (에러가 났던 원인 해결)
export interface AuthState {
  isLoggedIn: boolean; // Topbar.tsx 에서 찾는 값
  userInfo: UserInfo | null; // SidebarAuth.tsx 에서 찾는 값
  user: UserInfo | null; // useJobComment.ts 에서 찾는 값 (userInfo와 동일한 데이터)
  login: (userInfo: UserInfo) => void;
  logout: () => void;
}

// 3. 스토어 생성
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      userInfo: null,
      user: null,

      // 로그인 시 userInfo와 user 모두에 데이터를 넣어줍니다.
      login: (userInfo) =>
        set({
          isLoggedIn: true,
          userInfo: userInfo,
          user: userInfo,
        }),

      // 로그아웃 시 모두 초기화
      logout: () =>
        set({
          isLoggedIn: false,
          userInfo: null,
          user: null,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      // 세션 스토리지에 저장할 항목들
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userInfo: state.userInfo,
        user: state.userInfo,
      }),
    },
  ),
);
