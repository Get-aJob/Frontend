import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { JobPosting } from '@/types/Posting';
import Button from '@/components/common/UI/Button';
import { ExternalLink, Search, Bookmark } from 'lucide-react';
import ConfirmModal from '@/components/common/UI/ConfirmModal';
import { toggleScrap } from '@/api/Scrap';
import { incrementViewCount } from '@/api/Posting';

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
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'confirm' | 'success'>('confirm');
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    confirmText: '',
  });

  // 상세보기 클릭 시 조회수 증가 및 상세 모달 오픈
  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    incrementViewCount(job.id);
    onDetailClick();
  };

  // 스크랩 버튼 클릭 시 최초 확인 모달 설정
  const handleScrapClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (job.isScrapped) {
      // 이미 스크랩된 경우 바로 해제 확인 단계로
      setModalMode('confirm');
      setModalContent({
        title: '스크랩 해제',
        message: '이 공고를 스크랩 목록에서 제거하시겠습니까?',
        confirmText: '해제하기',
      });
    } else {
      // 스크랩 전이라면 질문 없이 바로 실행하거나, 혹은 질문 단계를 거칩니다.
      // 사용자 요청에 따라 "스크랩" 버튼 클릭 시 바로 등록 성공 모달로 가도록 로직을 실행합니다.
      handleConfirmScrap();
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmScrap = async () => {
    try {
      const result = await toggleScrap(String(job.id));
      onScrap(job.id);

      if (result.added) {
        // 💡 등록 성공 시 모달 내용 설정
        setModalContent({
          title: '스크랩 완료',
          message: '관심있는 공고로 등록되었습니다.',
          confirmText: '내가 저장한 스크랩 확인하기',
        });
        setModalMode('success');
        setIsModalOpen(true);
      } else {
        // 해제 완료 시에는 모달을 닫습니다.
        setIsModalOpen(false);
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        setModalContent({
          title: '권한 없음',
          message: '로그인이 필요한 기능입니다.',
          confirmText: '로그인하러 가기',
        });
        setModalMode('success');
        setIsModalOpen(true);
      } else {
        setIsModalOpen(false);
      }
    }
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!job.url) return;
    window.open(job.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className="flex gap-2 w-full items-center" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-10 gap-1.5 text-body font-black border-btn-point text-btn-point"
          onClick={handleDetailClick}
        >
          <Search size={14} strokeWidth={3} /> 상세보기
        </Button>

        <Button
          variant={job.isScrapped ? 'primary' : 'outline'}
          size="sm"
          className={`flex-1 h-10 gap-1.5 text-body font-black ${!job.isScrapped ? 'border-btn-point text-btn-point' : ''}`}
          onClick={handleScrapClick}
        >
          <Bookmark size={14} fill={job.isScrapped ? 'currentColor' : 'none'} strokeWidth={3} />
          {job.isScrapped ? '저장됨' : '스크랩'}
        </Button>

        <Button
          variant="primary"
          size="sm"
          className="flex-1 h-10 gap-1.5 bg-gray-900 border-gray-900 hover:bg-black disabled:bg-gray-200 text-body font-black"
          onClick={handleApplyClick}
          disabled={!job.url}
        >
          <ExternalLink size={14} strokeWidth={3} /> 사이트보기
        </Button>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        confirmText={modalContent.confirmText}
        cancelText="닫기"
        isDanger={modalMode === 'confirm' && job.isScrapped}
        onConfirm={() => {
          if (modalMode === 'confirm') {
            handleConfirmScrap();
          } else {
            if (modalContent.confirmText === '로그인하러 가기') {
              navigate('/auth');
            } else {
              navigate('/scrap');
            }
            setIsModalOpen(false);
          }
        }}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default PostingActionButtons;
