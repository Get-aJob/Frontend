import { useState, useRef, useEffect } from 'react';
import JobModal from '@/components/jobPostForm/JobModal';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from '@/components/common/UI/Toast';
import Button from '@/components/common/UI/Button';
import Badge from '@/components/common/UI/Badge';
import { MenuIcon } from 'lucide-react';
import { useMobilesidebarStore } from '@/store/useMobileSidebarStore';

export interface TopbarProps {
  title?: string;
  badge?: string;
  showAddButton?: boolean;
  unreadCount?: number;
}

const Topbar = ({ title, badge, showAddButton, unreadCount = 0 }: TopbarProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggle = useMobilesidebarStore((state) => state.toggle);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const handleAddButtonClick = () => {
    if (!isLoggedIn) {
      setShowToast(true);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => setShowToast(false), 3000);
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      {/* ✨ 모바일에서 px-4로 여백을 줄여 아이콘을 왼쪽 끝에 더 밀착, 높이(h-16) 축소 */}
      <header className="flex items-center px-4 sm:px-8 gap-2 sm:gap-4 h-16 sm:h-20 w-full bg-white border-b border-border-light shrink-0 sticky top-0 z-30 shadow-none">
        <div className="flex items-center gap-1 sm:gap-3 text-lg sm:text-[1.35rem] font-black text-slate-800 tracking-tight">
          <button
            onClick={() => {
              toggle();
            }}
            /* ✨ 패딩을 p-1.5로 줄여서 여백 최소화 */
            className="lg:hidden cursor-pointer p-1.5 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
          >
            <MenuIcon size={22} />
          </button>
          <span className="ml-1">{title}</span>
          {badge && (
            <Badge variant="point" className="px-2 py-0.5 text-[9px] sm:text-[11px] font-bold">
              {badge}
            </Badge>
          )}
          {isLoggedIn && unreadCount > 0 && (
            <Badge variant="error" className="px-2 py-0.5 text-[9px] sm:text-[11px] font-bold">
              {unreadCount}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 ml-auto">
          {showAddButton && (
            <Button
              variant="primary"
              onClick={handleAddButtonClick}
              className="px-3.5 py-1.5 h-9 sm:h-10.5 rounded-lg sm:rounded-xl font-bold text-body sm:text-sm"
            >
              ＋ 공고 등록
            </Button>
          )}
        </div>
      </header>
      <Toast
        visible={showToast}
        message="공고 등록은 로그인 후 이용할 수 있어요."
        showLoginButton
      />
      <JobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Topbar;
