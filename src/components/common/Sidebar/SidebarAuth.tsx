import { Link, useNavigate } from 'react-router-dom';
import { PATH } from '@/router/Path';
import { useAuthStore } from '@/store/useAuthStore';
import { logoutApi } from '@/api/Auth';

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
    <div className="p-4 border-t border-[#e8eaf0]">
      {!isLoggedIn ? (
        <Link
          to={PATH.AUTH}
          className="flex items-center justify-center gap-2 w-full p-2.5 rounded-[10px] bg-linear-to-br from-[#4f46e5] to-[#8b5cf6] text-white text-[13px] font-bold shadow-[0_4px_12px_rgba(79,70,229,0.2)] hover:opacity-90 transition-opacity"
        >
          <span>🔐</span> 로그인 / 시작하기
        </Link>
      ) : (
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8.5 h-8.5 rounded-full bg-[#6366f1] text-[13px] font-extrabold text-white shrink-0">
            {userInfo?.name ? userInfo.name.charAt(0) : '유'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-[#111827] truncate">
              {userInfo?.name || '유저'}
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleLogout}
              className="px-2 py-1 text-[11px] font-medium text-[#6b7280] hover:text-[#ef4444] hover:bg-[#fee2e2] rounded-md transition-colors cursor-pointer"
            >
              로그아웃
            </button>
            <button
              onClick={() => navigate(PATH.SETTINGS)}
              className="p-1 text-[16px] text-[#9ca3af] hover:text-[#6b7280] transition-colors cursor-pointer"
              title="설정"
            >
              ⚙
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarAuth;
