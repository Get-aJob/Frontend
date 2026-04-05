import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✨ 페이지 이동을 위해 추가
import { toggleScrap } from '@/api/Scrap';
import { usePostingStore } from '@/store/usePostingStore';
import JobModal from '@/components/jobPostForm/JobModal';
import PostingDetailModal from '@/components/Posting/PostingDetailModal';
import ConfirmModal from '@/components/common/UI/ConfirmModal'; // ✨ Confirm 모달 임포트
import type { JobPosting } from '@/types/Posting';
import Button from '@/components/common/UI/Button';
import { Bookmark, ExternalLink, Trash2, Search } from 'lucide-react';
import { PATH } from '@/router/Path'; // ✨ 경로 상수 임포트

interface PostingActionButtonsProps {
  job: JobPosting & { isScrapped?: boolean; sourceType?: string; externalId?: string };
}

const PostingActionButtons: React.FC<PostingActionButtonsProps> = ({ job }) => {
  const navigate = useNavigate(); // ✨ 네비게이션 훅
  const { toggleScrapStatus, deleteJob } = usePostingStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // ✨ 스크랩 완료/해제 확인 모달 상태 추가
  const [isScrapModalOpen, setIsScrapModalOpen] = useState(false);
  const [isScrapAdded, setIsScrapAdded] = useState(false); // 저장인지 해제인지 구분

  const handleScrapClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const result = await toggleScrap(String(job.id));
      toggleScrapStatus(job.id);

      // ✨ alert 대신 모달 상태 업데이트 및 띄우기
      setIsScrapAdded(result.added);
      setIsScrapModalOpen(true);
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        alert('로그인이 필요한 기능입니다.');
      } else {
        alert('처리에 실패했습니다.');
      }
    }
  };

  // ✨ 스크랩 페이지로 이동
  const handleGoToScrap = () => {
    setIsScrapModalOpen(false);
    navigate(PATH.SCRAP);
  };

  const handleSiteGoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!job.url) {
      alert('연결된 사이트 주소가 없습니다.');
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
        console.error('삭제 중 오류 발생:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDetailModalOpen(true);
  };

  const isManual = job.sourceType !== 'auto';

  return (
    <>
      <div className="flex gap-2 w-full mt-4 items-center">
        {/* 상세보기 버튼 */}
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-1.5 border-gray-200 text-gray-600 hover:border-btn-point hover:text-btn-point"
          onClick={handleDetailClick}
        >
          <Search size={14} /> 상세보기
        </Button>

        {/* 스크랩 버튼 */}
        <Button
          variant={job.isScrapped ? 'primary' : 'outline'}
          size="sm"
          className={`flex-1 gap-1.5 ${!job.isScrapped ? 'border-btn-point text-btn-point' : ''}`}
          onClick={handleScrapClick}
        >
          <Bookmark size={14} fill={job.isScrapped ? 'currentColor' : 'none'} />
          {job.isScrapped ? '저장됨' : '스크랩'}
        </Button>

        {/* 원본 사이트 버튼 */}
        <Button
          variant="primary"
          size="sm"
          className="flex-1 gap-1.5 bg-gray-900 border-gray-900 hover:bg-black disabled:bg-gray-200 disabled:border-gray-200"
          onClick={handleSiteGoClick}
          disabled={!job.url}
        >
          <ExternalLink size={14} /> 원본 사이트
        </Button>

        {/* 삭제 버튼 (수동 등록일 경우만) */}
        {isManual && (
          <Button
            variant="outline"
            size="sm"
            className="flex-initial px-3 border-status-error text-status-error hover:bg-red-50"
            onClick={handleDeleteClick}
          >
            <Trash2 size={14} />
          </Button>
        )}
      </div>

      {/* 공고 상세 보기 모달 */}
      {isDetailModalOpen && (
        <PostingDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          job={job}
        />
      )}

      {/* 공고 수정 모달 */}
      {isEditModalOpen && (
        <JobModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          mode="edit"
          initialData={job}
        />
      )}

      {/* ✨ 스크랩 완료/해제 확인 모달 */}
      <div className="relative z-[200]">
        <ConfirmModal
          isOpen={isScrapModalOpen}
          onClose={() => setIsScrapModalOpen(false)}
          // 저장 시 스크랩 페이지로 이동, 해제 시 그냥 닫기
          onConfirm={isScrapAdded ? handleGoToScrap : () => setIsScrapModalOpen(false)}
          title={isScrapAdded ? '스크랩 완료' : '스크랩 해제'}
          message={
            isScrapAdded ? '공고가 성공적으로 저장되었습니다.' : '공고 저장이 해제되었습니다.'
          }
          confirmText={isScrapAdded ? '스크랩 확인하기' : '확인'}
          cancelText="닫기"
        />
      </div>
    </>
  );
};

export default PostingActionButtons;
