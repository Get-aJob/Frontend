import React, { useState } from 'react';
import type { JobPosting } from '@/types/Posting';
import Button from '@/components/common/UI/Button';
import { ExternalLink, Search, Bookmark } from 'lucide-react';
import ConfirmModal from '@/components/common/UI/ConfirmModal'; // 💡 커스텀 모달 활용
import { toggleScrap } from '@/api/Scrap';

interface PostingActionButtonsProps {
  job: JobPosting;
  onScrap: (id: string | number) => void;
  onDetailClick: () => void;
}

const PostingActionButtons: React.FC<PostingActionButtonsProps> = ({
  job,
  onScrap,
  onDetailClick,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleScrapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleConfirmScrap = async () => {
    try {
      const result = await toggleScrap(String(job.id));
      onScrap(job.id);

      if (result.added) {
        alert('공고가 스크랩되었습니다.');
      } else {
        alert('스크랩이 해제되었습니다.');
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        alert('로그인이 필요한 기능입니다. 로그인 후 이용해주세요.');
      } else {
        alert('처리 중 오류가 발생했습니다. 다시 시도해주세요.');
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

  return (
    <>
      <div className="flex gap-2 w-full items-center" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-10 gap-1.5 text-[11px] font-black border-btn-point text-btn-point"
          onClick={(e) => {
            e.stopPropagation();
            onDetailClick();
          }}
        >
          <Search size={14} strokeWidth={3} /> 상세보기
        </Button>

        <Button
          variant={job.isScrapped ? 'primary' : 'outline'}
          size="sm"
          className={`flex-1 h-10 gap-1.5 text-[11px] font-black ${!job.isScrapped ? 'border-btn-point text-btn-point' : ''}`}
          onClick={handleScrapClick}
        >
          <Bookmark size={14} fill={job.isScrapped ? 'currentColor' : 'none'} strokeWidth={3} />
          {job.isScrapped ? '저장됨' : '스크랩'}
        </Button>

        <Button
          variant="primary"
          size="sm"
          className="flex-1 h-10 gap-1.5 bg-gray-900 border-gray-900 hover:bg-black disabled:bg-gray-200 text-[11px] font-black"
          onClick={handleApplyClick}
          disabled={!job.url}
        >
          <ExternalLink size={14} strokeWidth={3} /> 사이트보기
        </Button>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        title={job.isScrapped ? '스크랩 해제' : '공고 스크랩'}
        message={job.isScrapped ? '스크랩을 해제하시겠습니까?' : '이 공고를 스크랩하시겠습니까?'}
        confirmText={job.isScrapped ? '해제' : '스크랩'}
        isDanger={job.isScrapped}
        onConfirm={handleConfirmScrap}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default PostingActionButtons;
