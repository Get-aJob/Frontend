import { Link } from 'react-router-dom';
import { PATH } from '@/router/Path';
import { ChevronLeft } from 'lucide-react';
import { useMobilesidebarStore } from '@/store/useMobileSidebarStore';

const SidebarLogo = () => {
  const close = useMobilesidebarStore((state) => state.close);
  return (
    <div className="px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20 border-b border-border-light shrink-0">
      <Link
        to={PATH.ROOT}
        className="flex items-center gap-3 sm:gap-4 hover:opacity-90 transition-opacity"
      >
        <img
          src="/GobMoa.png"
          alt="취업모아 로고"
          // ✨ 로고 이미지 크기 축소
          className="h-9 sm:h-12 w-auto object-contain shrink-0"
        />
        <div>
          {/* ✨ 텍스트 크기 축소 */}
          <div className="text-[14px] sm:text-title font-extrabold text-gray-900 tracking-tight leading-none">
            취업모아
          </div>
          <div className="text-[10px] sm:text-body text-gray-400 mt-1 sm:mt-1.5 font-medium leading-none">
            취업 지원 관리
          </div>
        </div>
      </Link>
      <div
        onClick={() => close()}
        // ✨ 모바일에서 버튼 패딩 축소
        className="lg:hidden cursor-pointer p-1.5 sm:p-2 mx-1 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
      >
        <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
      </div>
    </div>
  );
};

export default SidebarLogo;
