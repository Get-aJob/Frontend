import { useState, useRef, useEffect } from 'react';
import JobModal from '@/components/jobPostForm/JobModal';
import { useAuthStore } from '@/store/useAuthStore';
import LoginToast from './LoginToast';
import Button from '@/components/common/UI/Button';
import Badge from '@/components/common/UI/Badge';

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
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
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
      <header className="flex items-center px-8 gap-4 h-20 w-full bg-white border-b border-border-light shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3 text-title font-extrabold text-gray-900">
          <span>{title}</span>
          {badge && <Badge variant="point">{badge}</Badge>}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {showSearch && (
            <div className="flex items-center gap-2 w-64 px-4 py-2 bg-bg-view border border-border-light rounded-xl transition-all focus-within:border-btn-point focus-within:ring-1 focus-within:ring-btn-point">
              <label htmlFor="topbar-search" className="sr-only">
                공고 검색
              </label>
              <span aria-hidden="true" className="text-gray-400 text-sm">
                🔍
              </span>
              <input
                id="topbar-search"
                aria-label="공고 검색"
                className="w-full bg-transparent border-none outline-none text-[13px] placeholder:text-gray-400"
                placeholder="검색어를 입력하세요..."
              />
            </div>
          )}

          {showAddButton && (
            <Button
              onClick={handleAddButtonClick}
              className="px-5 py-2.5 h-11 rounded-xl shadow-sm font-bold"
            >
              ＋ 공고 등록
            </Button>
          )}
        </div>
      </header>

      <LoginToast visible={showLoginToast} />
      <JobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Topbar;
