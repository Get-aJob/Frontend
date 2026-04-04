import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, Download, Trash2, Edit3, Pencil } from 'lucide-react';
import Button from '@/components/common/UI/Button';
import Badge from '@/components/common/UI/Badge';
import ResumeDownloadButton from '@/components/resumeForm/ResumeDownloadButton';
import UpdateTitleForm from './UpdateTitleForm';

import type { ResumeInfo } from '@/types/ResumeFormType';

interface ResumeItemProps {
  resume: ResumeInfo;
  onDelete?: () => void;
}

const ResumeItem = ({ resume, onDelete }: ResumeItemProps) => {
  const navigate = useNavigate();
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <div
      onClick={() => navigate(`/resume/${resume.id}`)}
      className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-300 cursor-pointer border-l-4 border-l-transparent hover:border-l-btn-point flex flex-col h-full min-h-48"
    >
      <div className="flex justify-between items-start mb-5">
        <div className="p-3 bg-indigo-50 rounded-lg text-btn-point group-hover:bg-btn-point group-hover:text-white transition-colors">
          <FileText size={24} />
        </div>
        <div className="flex gap-2 items-center">
          <Badge variant="point">이력서</Badge>
          {onDelete && (
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onDelete();
              }}
              className="text-gray-300 hover:text-status-error transition-colors p-1.5 rounded-md hover:bg-red-50"
              title="삭제"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {isEditingTitle ? (
        <UpdateTitleForm
          id={String(resume.id)}
          title={resume.title}
          setIsFormOpen={setIsEditingTitle}
        />
      ) : (
        <div className="flex items-center justify-between gap-2 mb-2 min-h-4xl">
          <h3 className="text-subtitle font-bold text-gray-900 line-clamp-1 group-hover:text-btn-point transition-colors">
            {resume.title || '제목 없는 이력서'}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditingTitle(true);
            }}
            className="text-gray-300 hover:text-btn-point opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-indigo-50 shrink-0"
            title="제목 수정"
          >
            <Pencil size={14} />
          </button>
        </div>
      )}

      <div className="flex items-center text-xs text-gray-500 mb-6 gap-1.5 font-medium mt-auto">
        <Calendar size={14} />
        <span>작성일: {new Date(resume.createdAt).toLocaleDateString()}</span>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            navigate(`/resume/${resume.id}`);
          }}
        >
          <Edit3 size={14} /> 내용 수정
        </Button>

        <div onClick={(e) => e.stopPropagation()}>
          <ResumeDownloadButton
            id={String(resume.id)}
            className="inline-flex items-center justify-center border-[1.5px] border-btn-point text-btn-point bg-white hover:bg-purple-50 rounded-md px-3 py-1.5 transition-all duration-200 active:scale-95 cursor-pointer h-full"
          >
            <Download size={14} />
          </ResumeDownloadButton>
        </div>
      </div>
    </div>
  );
};

export default ResumeItem;
