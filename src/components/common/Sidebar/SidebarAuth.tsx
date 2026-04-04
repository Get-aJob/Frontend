// src/components/common/Sidebar/SidebarAuth.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from '@/router/Path';
import { useAuthStore } from '@/store/useAuthStore';
import { logoutApi } from '@/api/Auth';
import Button from '@/components/common/UI/Button';
import ConfirmModal from '@/components/common/UI/ConfirmModal';
import { LogIn, Loader2 } from 'lucide-react';

const SidebarAuth = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userInfo, logout } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutApi();
      logout();
      navigate(PATH.POSTING);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      setIsLoggingOut(false);
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
              onClick={() => setIsModalOpen(true)}
              disabled={isLoggingOut}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-gray-500 hover:text-status-error hover:bg-red-50 rounded-md transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  처리중
                </>
              ) : (
                '로그아웃'
              )}
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="로그아웃"
        message="정말 로그아웃 하시겠습니까?"
        confirmText="로그아웃"
        isDanger={true}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default SidebarAuth;
