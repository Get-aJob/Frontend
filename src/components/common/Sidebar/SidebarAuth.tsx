// src/components/common/Sidebar/SidebarAuth.tsx
import { useNavigate } from 'react-router-dom';
import { PATH } from '@/router/Path';
import { useAuthStore } from '@/store/useAuthStore';
import { logoutApi } from '@/api/Auth';
import Button from '@/components/common/UI/Button';
import { LogIn } from 'lucide-react';

const SidebarAuth = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userInfo, logout } = useAuthStore();

  const handleLogout = async () => {
    if (!window.confirm('로그아웃 하시겠습니까?')) return;
    try {
      await logoutApi();
      logout();
      alert('로그아웃 되었습니다.');
      navigate(PATH.POSTING);
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="p-4 border-t border-border-light">
      {!isLoggedIn ? (
        <Button size="md" className="w-full gap-2 text-sm" onClick={() => navigate(PATH.AUTH)}>
          <LogIn size={18} /> 로그인 / 회원가입
        </Button>
      ) : (
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-btn-point text-body font-extrabold text-white shrink-0 overflow-hidden">
            {userInfo?.profile_image_url ? (
              <img
                src={userInfo.profile_image_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : userInfo?.name ? (
              userInfo.name.charAt(0)
            ) : (
              '유'
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-gray-900 truncate">
              {userInfo?.name || '유저'}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleLogout}
              className="px-2 py-1 text-[11px] font-bold text-gray-500 hover:text-status-error hover:bg-red-50 rounded-md transition-colors cursor-pointer"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarAuth;
