import { MoreVertical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeItemMenuStore } from '@/store/useResumeItemMenuStore';
import { useDeleteResume } from '@/hooks/resume';

interface ResumeItemProps {
  title: string;
  id: string;
  updatedAt: string;
}

const ResumeItem = ({ title, id, updatedAt }: ResumeItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  const { mutate } = useDeleteResume();

  const { isAnyMenuOpen, setIsAnyMenuOpen } = useResumeItemMenuStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        if (isOpen) {
          setIsOpen(false);
          setIsAnyMenuOpen(false);
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen, setIsAnyMenuOpen]);

  const date = new Date(updatedAt);

  return (
    <div className="w-full h-64 xl:h-75 relative ">
      <div
        className="w-full h-full rounded-2xl p-7 bg-blue-50 border-2 border-blue-100 hover:border-blue-200 z-0"
        onClick={() => {
          if (!isAnyMenuOpen && !isOpen) {
            navigate(`/resume/${id}`);
          }
        }}
      >
        <h1 className="text-2xl">{title}</h1>
        <p>{date.toISOString().split('T')[0]}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          const nextState = !isOpen;
          setIsOpen(nextState);
          setIsAnyMenuOpen(nextState);
        }}
        ref={menuRef}
        className="absolute top-5 right-7 rounded-2xl py-2 px-0.5 hover:bg-black/5 z-10"
      >
        <MoreVertical size={30} />
      </button>
      {isOpen && (
        <div
          className={
            'absolute top-14 right-7 w-52 rounded-xl overflow-hidden bg-white z-20 shadow-md'
          }
        >
          <p onClick={() => alert('a')} className="p-3 hover:bg-black/5">
            이력서 제목 변경
          </p>
          <p className="p-3 hover:bg-black/5">사본 만들기</p>
          <p className="p-3 hover:bg-black/5">다운로드</p>
          <p className="p-3 hover:bg-black/5">미리보기</p>
          <button onClick={() => mutate(id)} className="w-full p-3 hover:bg-black/5 text-start">
            이력서 삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeItem;
