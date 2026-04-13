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
      setIsModalOpen(false);
    }
  };

  return (
    // ✨ 컨테이너 패딩 축소
    <div className="p-3 sm:p-4 mt-auto border-t border-border-light sm:border-t-0">
      {!isLoggedIn ? (
        // ✨ 버튼 사이즈 모바일 최적화 (Button 컴포넌트의 sm 반응형 적용을 위해 className에 제어 추가)
        <Button
          size="md"
          className="w-full gap-1.5 sm:gap-2 h-9 sm:h-10 text-[11px] sm:text-sm"
          onClick={() => navigate(PATH.AUTH)}
        >
          <LogIn size={16} className="sm:w-[18px] sm:h-[18px]" /> 로그인 / 회원가입
        </Button>
      ) : (
        <div className="flex items-center gap-2 sm:gap-2.5 p-1.5 sm:p-2 rounded-xl border border-gray-100 bg-gray-50/30">
          {/* ✨ 프로필 아바타 축소 */}
          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-btn-point text-white font-extrabold shrink-0 overflow-hidden text-[11px] sm:text-xs">
            {userInfo?.profile_image_url ? (
              <img
                src={userInfo.profile_image_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              userInfo?.name?.charAt(0) || '유'
            )}
          </div>
          <div className="flex-1 min-w-0">
            {/* ✨ 이름 축소 */}
            <div className="text-[12px] sm:text-[13px] font-bold text-gray-900 truncate">
              {userInfo?.name || '유저'}
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            // ✨ 로그아웃 버튼 텍스트 축소
            className="px-2 py-1 text-[10px] sm:text-[11px] font-bold text-gray-400 hover:text-status-error transition-colors"
          >
            {isLoggingOut ? <Loader2 size={12} className="animate-spin" /> : '로그아웃'}
          </button>
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
