import { useState, useRef, useEffect } from 'react';
import JobModal from '@/components/jobPostForm/JobModal';
import { useAuthStore } from '@/store/useAuthStore';
import LoginToast from './LoginToast'; // 💡 올바른 상대 경로로 수정됨

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
  const [showLoginToast, setShowLoginToast] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const handleAddButtonClick = () => {
    if (!isLoggedIn) {
      setShowLoginToast(true);
      toastTimeoutRef.current = setTimeout(() => setShowLoginToast(false), 3000);
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <header className="flex items-center px-6 gap-3 min-h-20 w-full py-4 bg-white border-b border-[#e8eaf0] z-100 shrink-0">
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
              <label htmlFor="topbar-search" className="sr-only">
                공고 검색
              </label>
              <span aria-hidden="true">🔍</span>
              <input
                id="topbar-search"
                aria-label="공고 검색"
                className="w-full bg-transparent border-none outline-none text-[13px] focus-visible:ring-2 focus-visible:ring-[#4f46e5] rounded-sm"
                placeholder="검색어를 입력하세요..."
              />
            </div>
          )}

          {showAddButton && (
            <button
              onClick={handleAddButtonClick}
              className="px-4 py-2 text-[13px] font-bold text-white bg-[#4f46e5] rounded-[10px] hover:bg-[#4338ca] transition-colors"
            >
              ＋ 공고 등록
            </button>
          )}
        </div>
      </header>

      <LoginToast visible={showLoginToast} />

      <JobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Topbar;
