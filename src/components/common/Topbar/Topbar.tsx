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
      // 기존 타이머가 있다면 초기화하여 토스트가 조기에 닫히는 것을 방지
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => setShowToast(false), 3000);
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <header className="flex items-center px-8 gap-4 h-20 w-full bg-white border-b border-border-light shrink-0 sticky top-0 z-30 shadow-none">
        <div className="flex items-center gap-3 text-[1.35rem] font-black text-slate-800 tracking-tight">
          <button
            onClick={() => {
              toggle();
            }}
            className="lg:hidden cursor-pointer p-2 mx-1 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
          >
            <MenuIcon />
          </button>
          <span>{title}</span>
          {badge && (
            <Badge variant="point" className="px-2.5 py-1 text-[11px] font-bold">
              {badge}
            </Badge>
          )}
          {isLoggedIn && unreadCount > 0 && (
            <Badge variant="error" className="px-2.5 py-1 text-[11px] font-bold">
              미확인 {unreadCount}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 ml-auto">
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
