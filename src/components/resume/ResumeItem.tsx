import { MoreVertical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useResumeItemMenuStore } from '@/store/useResumeItemMenuStore';

interface ResumeItemProps {
  title: string;
  memo?: string;
  updatedAt: string;
}

const ResumeItem = ({ title, memo, updatedAt }: ResumeItemProps) => {
  const [isOpen, setIsOpen] = useState(0);
  const menuRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  const { isAnyMenuOpen, setIsAnyMenuOpen } = useResumeItemMenuStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen((value) => {
          if (value > 0) {
            setIsAnyMenuOpen(false);
            return value - 1;
          } else {
            return value;
          }
        });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsAnyMenuOpen]);

  return (
    <div className="w-full h-64 xl:h-75 relative">
      <div
        className="w-full h-full rounded-2xl p-7 bg-blue-50 border-2 border-blue-100 hover:border-blue-200 z-0"
        onClick={() => {
          if (!isAnyMenuOpen && !isOpen) {
            navigate('/');
          } else {
            setIsOpen((value) => value - 1);
            setIsAnyMenuOpen(false);
          }
        }}
      >
        <h1 className="text-2xl">{title}</h1>
        <p className="text-black/50">{memo || '더보기를 눌러 메모를 입력하세요.'}</p>
        <p>{updatedAt}</p>
      </div>
      <button
        className="absolute top-5 right-7 rounded-2xl py-2 px-0.5 hover:bg-black/5 z-10"
        onClick={() => {
          if (isOpen > 1) {
            setIsAnyMenuOpen(false);
            setIsOpen(0);
          } else {
            setIsAnyMenuOpen(true);
            setIsOpen(2);
          }
        }}
        ref={menuRef}
      >
        <MoreVertical size={30} />
      </button>
      <div
        className={clsx(
          isOpen > 1
            ? 'absolute top-14 right-7 w-52 rounded-xl overflow-hidden bg-white z-20 shadow-md'
            : 'hidden',
        )}
      >
        <p className="p-3 hover:bg-black/5">이력서 제목 변경</p>
        <p className="p-3 hover:bg-black/5">사본 만들기</p>
        <p className="p-3 hover:bg-black/5">다운로드</p>
        <p className="p-3 hover:bg-black/5">미리보기</p>
        <p className="p-3 hover:bg-black/5">메모 설정</p>
      </div>
    </div>
  );
};

export default ResumeItem;
