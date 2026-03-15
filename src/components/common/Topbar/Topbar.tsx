import { useState } from 'react';
import AddJobModal from './AddJobModal';

export interface TopbarProps {
  title?: string;
  badge?: string;
  showSearch?: boolean;
  showAddButton?: boolean;
}

const Topbar = ({
  title = '페이지 제목',
  badge,
  showSearch = false,
  showAddButton = false,
}: TopbarProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="flex items-center px-6 gap-3 w-full py-4 bg-white border-b border-[#e8eaf0] z-100 shrink-0">
        <div className="flex items-center gap-2 text-lg font-extrabold text-[#111827]">
          <span>{title}</span>
          {badge && (
            <span className="text-[10px] font-bold px-2.25 py-0.75 rounded-[5px] bg-[#eef2ff] text-[#4f46e5]">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2.5 ml-auto">
          {showSearch && (
            <div className="flex items-center gap-1.75 w-55 px-3.5 py-2 bg-[#f8f9fc] border-[1.5px] border-[#e8eaf0] rounded-[10px]">
              <span>🔍</span>
              <input
                className="w-full bg-transparent border-none outline-none text-[13px]"
                placeholder="검색어를 입력하세요..."
              />
            </div>
          )}

          {showAddButton && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-[13px] font-bold text-white bg-[#4f46e5] rounded-[10px] hover:bg-[#4338ca] transition-colors"
            >
              ＋ 공고 등록
            </button>
          )}
        </div>
      </header>

      <AddJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Topbar;
