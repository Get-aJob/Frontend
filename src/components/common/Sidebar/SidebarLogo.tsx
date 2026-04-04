import { Link } from 'react-router-dom';
import { PATH } from '@/router/Path';

const SidebarLogo = () => {
  return (
    <div className="px-5 py-5 border-b border-border-light">
      {' '}
      <Link to={PATH.ROOT} className="flex items-center gap-4 hover:opacity-90 transition-opacity">
        {' '}
        <img
          src="/GobMoa.png"
          alt="취업모아 로고"
          className="h-12 w-auto object-contain shrink-0"
        />
        <div>
          <div className="text-title font-extrabold text-gray-900 tracking-tight">취업모아</div>
          <div className="text-body text-gray-500 mt-1 font-medium">취업 지원 관리</div>{' '}
        </div>
      </Link>
    </div>
  );
};

export default SidebarLogo;
