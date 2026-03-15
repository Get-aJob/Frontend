import { Link, useNavigate } from 'react-router-dom';
import { PATH } from '@/router/Path';

interface SidebarAuthProps {
  isLoggedIn?: boolean;
}

const SidebarAuth = ({ isLoggedIn = false }: SidebarAuthProps) => {
  const navigate = useNavigate();

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
          <div className="flex items-center justify-center w-8.5 h-8.5rounded-full bg-[#6366f1] text-[13px] font-extrabold text-white shrink-0">
            김
          </div>
          <div>
            <div className="text-[13px] font-bold text-[#111827]">김개발</div>
            <div className="text-[11px] text-[#9ca3af]">프론트엔드 지망</div>
          </div>
          <button
            onClick={() => navigate(PATH.SETTINGS)}
            className="ml-auto p-1 text-[16px] text-[#9ca3af] hover:text-[#6b7280] transition-colors cursor-pointer"
          >
            ⚙
          </button>
        </div>
      )}
    </div>
  );
};

export default SidebarAuth;
