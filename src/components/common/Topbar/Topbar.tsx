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

const Topbar = ({ title, badge, showSearch, showAddButton }: TopbarProps) => {
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
      <header className="flex items-center px-8 gap-4 h-20 w-full bg-white border-b border-border-light shrink-0 sticky top-0 z-30 shadow-none">
        <div className="flex items-center gap-3 text-[1.35rem] font-black text-slate-800 tracking-tight">
          <span>{title}</span>
          {badge && (
            <Badge variant="point" className="px-2.5 py-1 text-[11px] font-bold">
              {badge}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 ml-auto">
          {showSearch && (
            <div className="flex items-center gap-2 w-72 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus-within:bg-white focus-within:border-btn-point transition-all">
              <span className="text-gray-400 text-sm">🔍</span>
              <input
                className="w-full bg-transparent border-none outline-none text-[14px] font-medium text-slate-700 placeholder:text-gray-400"
                placeholder="검색어를 입력하세요..."
              />
            </div>
          )}
          {showAddButton && (
            <Button
              variant="primary"
              onClick={handleAddButtonClick}
              className="px-6 py-2.5 h-10.5 rounded-xl font-bold text-sm"
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
