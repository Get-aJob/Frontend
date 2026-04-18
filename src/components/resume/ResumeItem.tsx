import { MoreVertical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeItemMenuStore } from '@/store/useResumeItemMenuStore';
import { useDeleteResume, useDuplicateResume } from '@/hooks/useResume';
import UpdateTitleForm from './UpdateTitleForm';
import ResumeDownloadButton from '../resumeForm/ResumeDownloadButton';
import ResumeFormPreviewButton from '../resumeForm/ResumeFormPreviewButton';

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
    <div className="w-full h-44 xl:h-55 relative group">
      <div
        ref={itemRef}
        onClick={() => {
          if (!isAnyMenuOpen && !isOpen && !isFormOpen) {
            navigate(`/resume/${id}`);
          }
        }}
        className="w-full h-full bg-white border border-border-light rounded-3xl p-6 transition-all group-hover:border-btn-point hover:shadow-md cursor-pointer"
      >
        {isFormOpen ? (
          <UpdateTitleForm id={id} title={title} setIsFormOpen={setIsFormOpen} />
        ) : (
          <div className="flex flex-col gap-4 overflow-hidden">
            <h1 className="text-2xl w-10/12 truncate">{title}</h1>
            <p className="font-black text-gray-400 tracking-tight">
              {date.toISOString().split('T')[0]}
            </p>
          </div>
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
        className="absolute top-5 right-7 rounded-2xl py-2 px-0.5 hover:bg-black/5 z-10 cursor-pointer"
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
          <ResumeFormPreviewButton id={id} className="w-full p-3 hover:bg-black/5 text-start">
            미리보기
          </ResumeFormPreviewButton>
          <button onClick={() => deleteMutate(id)} className="p-3 hover:bg-black/5 text-start">
            이력서 삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeItem;
