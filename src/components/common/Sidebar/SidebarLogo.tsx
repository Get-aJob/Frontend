import { Link } from 'react-router-dom';
import { PATH } from '@/router/Path';

const SidebarLogo = () => {
  return (
    <div className="px-6 flex items-center h-20 border-b border-border-light shrink-0">
      <Link to={PATH.ROOT} className="flex items-center gap-4 hover:opacity-90 transition-opacity">
        <img
          src="/GobMoa.png"
          alt="취업모아 로고"
          className="h-12 w-auto object-contain shrink-0"
        />
        <div>
          <div className="text-title font-extrabold text-gray-900 tracking-tight leading-none">
            취업모아
          </div>
          <div className="text-body text-gray-400 mt-1.5 font-medium leading-none">
            취업 지원 관리
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SidebarLogo;
