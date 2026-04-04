// src/components/common/Sidebar/SidebarLogo.tsx
import { Link } from 'react-router-dom';
import { PATH } from '@/router/Path';

const SidebarLogo = () => {
  return (
    <div className="px-5 py-4 border-b border-border-light">
      <Link to={PATH.ROOT} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-btn-point text-subtitle font-black text-white font-mono shadow-md">
          JOB
        </div>
        <div>
          <div className="text-title font-extrabold text-gray-900 tracking-tight">취업 모아</div>
          <div className="text-body text-gray-500 mt-0.5 font-medium">취업 지원 관리</div>
        </div>
      </Link>
    </div>
  );
};

export default SidebarLogo;
