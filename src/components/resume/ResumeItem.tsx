import { MoreVertical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeItemMenuStore } from '@/store/useResumeItemMenuStore';
import { useDeleteResume, useDuplicateResume } from '@/hooks/resume';
import UpdateTitleForm from './UpdateTitleForm';
import ResumeDownloadButton from '../resumeForm/ResumeDownloadButton';

interface ResumeItemProps {
  title: string;
  id: string;
  updatedAt: string;
}

const ResumeItem = ({ title, id, updatedAt }: ResumeItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement | null>(null);
  const itemRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { mutate: deleteMutate } = useDeleteResume();
  const { mutate: duplicateMutate } = useDuplicateResume();

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        itemRef.current &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !itemRef.current.contains(e.target as Node)
      ) {
        if (isFormOpen) {
          setIsFormOpen(false);
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isFormOpen, isOpen, setIsAnyMenuOpen]);

  const date = new Date(updatedAt);

  return (
    <div className="w-full h-64 xl:h-75 relative ">
      <div
        ref={itemRef}
        className="w-full h-full rounded-2xl p-7 bg-blue-50 border-2 border-blue-100 hover:border-blue-200 z-0"
        onClick={() => {
          if (!isAnyMenuOpen && !isOpen && !isFormOpen) {
            navigate(`/resume/${id}`);
          }
        }}
      >
        {isFormOpen ? (
          <UpdateTitleForm id={id} title={title} setIsFormOpen={setIsFormOpen} />
        ) : (
          <>
            <h1 className="text-2xl">{title}</h1>
            <p>{date.toISOString().split('T')[0]}</p>
          </>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          const nextState = !isOpen;
          if (isFormOpen) {
            setIsFormOpen(false);
          }
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
            'absolute flex flex-col top-14 right-7 w-52 rounded-xl overflow-hidden bg-white z-20 shadow-md'
          }
        >
          <button
            onClick={() => {
              setIsFormOpen(true);
            }}
            className="p-3 hover:bg-black/5 text-start"
          >
            이력서 제목 변경
          </button>
          <button onClick={() => duplicateMutate(id)} className="p-3 hover:bg-black/5 text-start">
            사본 만들기
          </button>
          <ResumeDownloadButton id={id} className="w-full p-3 hover:bg-black/5 text-start">
            다운로드
          </ResumeDownloadButton>
          <p className="p-3 hover:bg-black/5">미리보기</p>
          <button onClick={() => deleteMutate(id)} className="p-3 hover:bg-black/5 text-start">
            이력서 삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeItem;
