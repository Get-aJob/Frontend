import { Link } from 'react-router-dom';
import { PATH } from '@/router/Path';

const SidebarLogo = () => {
  return (
    <div className="px-4.5 py-4 border-b border-[#e8eaf0]">
      <Link to={PATH.ROOT} className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-10 h-10 rounded-[10px] bg-linear-to-br from-[#4f46e5] to-[#8b5cf6] text-[17px] font-black text-white font-mono shadow-[0_4px_14px_rgba(79,70,229,0.25)]">
          JOB
        </div>
        <div>
          <div className="text-[17px] font-extrabold text-[#111827] tracking-[-0.3px]">
            취업 모아
          </div>
          <div className="text-[10px] text-[#9ca3af] mt-0.5">취업 지원 관리</div>
        </div>
      </Link>
    </div>
  );
};

export default SidebarLogo;
