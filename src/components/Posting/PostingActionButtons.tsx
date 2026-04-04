import React, { useState } from 'react';
import { toggleScrap } from '@/api/Scrap';
import { usePostingStore } from '@/store/usePostingStore';
import JobModal from '@/components/jobPostForm/JobModal';
import type { JobPosting } from '@/types/Posting';
import Button from '@/components/common/UI/Button';
import { Bookmark, ExternalLink, Trash2 } from 'lucide-react';

interface PostingActionButtonsProps {
  job: JobPosting & { isScrapped?: boolean; sourceType?: string; externalId?: string };
}

const PostingActionButtons: React.FC<PostingActionButtonsProps> = ({ job }) => {
  const { toggleScrapStatus, deleteJob } = usePostingStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleScrapClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = await toggleScrap(String(job.id));
      toggleScrapStatus(job.id);

      if (result.added) {
        alert('공고가 저장되었습니다.');
      } else {
        alert('저장이 해제되었습니다.');
      }
    } catch (error: unknown) {
      // any 대신 unknown 사용
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        alert('로그인이 필요한 기능입니다.');
      } else {
        alert('처리에 실패했습니다.');
      }
    }
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!job.url) {
      alert('지원 주소가 없습니다.');
      return;
    }
    window.open(job.url, '_blank', 'noopener,noreferrer');
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!job.externalId) return;
    if (window.confirm('이 공고를 삭제하시겠습니까?')) {
      try {
        await deleteJob(job.externalId, job.sourceType);
        alert('삭제되었습니다.');
      } catch (error) {
        // error 변수를 로그에 활용하여 미사용 경고 해결
        console.error('삭제 중 오류 발생:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const isManual = job.sourceType !== 'auto';

  return (
    <>
      <div className="flex gap-2 w-full mt-4 items-center">
        {isManual && (
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-status-error text-status-error hover:bg-red-50 gap-1.5"
            onClick={handleDeleteClick}
          >
            <Trash2 size={14} /> 삭제
          </Button>
        )}

        <Button
          variant={job.isScrapped ? 'primary' : 'outline'}
          size="sm"
          className={`flex-1 gap-1.5 ${!job.isScrapped ? 'border-btn-point text-btn-point' : ''}`}
          onClick={handleScrapClick}
        >
          <Bookmark size={14} fill={job.isScrapped ? 'currentColor' : 'none'} />
          {job.isScrapped ? '저장됨' : '스크랩'}
        </Button>

        <Button
          variant="primary"
          size="sm"
          className="flex-1 gap-1.5 bg-gray-900 border-gray-900 hover:bg-black disabled:bg-gray-200 disabled:border-gray-200"
          onClick={handleApplyClick}
          disabled={!job.url}
        >
          <ExternalLink size={14} /> 지원하기
        </Button>
      </div>

      {isEditModalOpen && (
        <JobModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          mode="edit"
          initialData={job}
        />
      )}
    </>
  );
};

export default PostingActionButtons;
