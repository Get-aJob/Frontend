import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { usePostingStore } from '@/store/usePostingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import { useStatusStore } from '@/store/useStatusStore';
import { toggleScrap } from '@/api/Scrap';
import { useGetAllScraps } from '@/hooks/scraps';
import type { JobPosting } from '@/types/Posting';
import { PATH } from '@/router/Path';

export const useJobActions = (job: JobPosting | null) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { applications } = useStatusStore();
  const deleteJob = usePostingStore((state) => state.deleteJob);
  const toggleScrapStatus = usePostingStore((state) => state.toggleScrapStatus);
  const { data: scrapData } = useGetAllScraps(isLoggedIn);

  const isScrapped = scrapData?.some((s) => String(s.jobPostingId) === String(job?.id));
  const isApplied =
    isLoggedIn && applications.some((app) => String(app.jobPostingId) === String(job?.id));

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isScrapModalOpen, setIsScrapModalOpen] = useState(false);
  const [scrapModalMode, setScrapModalMode] = useState<'confirm' | 'success'>('confirm');
  const [scrapModalContent, setScrapModalContent] = useState({
    title: '',
    message: '',
    confirmText: '',
  });

  const handleConfirmScrap = async () => {
    if (!job) return;
    try {
      const result = await toggleScrap(String(job.id));
      toggleScrapStatus(job.id);
      queryClient.invalidateQueries({ queryKey: ['scraps', 'all'] });

      if (result.added) {
        setScrapModalContent({
          title: '스크랩 완료',
          message: '관심있는 공고로 등록되었습니다.',
          confirmText: '내가 저장한 스크랩 확인하기',
        });
        setScrapModalMode('success');
        setIsScrapModalOpen(true);
      } else {
        setIsScrapModalOpen(false);
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        setScrapModalContent({
          title: '권한 없음',
          message: '로그인이 필요한 기능입니다.',
          confirmText: '로그인하러 가기',
        });
        setScrapModalMode('success');
        setIsScrapModalOpen(true);
      } else {
        setIsScrapModalOpen(false);
      }
    }
  };

  const handleScrapClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!job) return;
    if (isScrapped) {
      setScrapModalMode('confirm');
      setScrapModalContent({
        title: '스크랩 해제',
        message: '이 공고를 스크랩 목록에서 제거하시겠습니까?',
        confirmText: '해제하기',
      });
      setIsScrapModalOpen(true);
    } else {
      handleConfirmScrap();
    }
  };

  const handleEdit = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!job?.externalId) {
      showToast('❌ 오류: 공고 식별자가 없습니다.');
      return;
    }
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (callback?: () => void) => {
    if (!job) return;
    try {
      await deleteJob(job.externalId!, 'manual');
      showToast('공고가 삭제되었습니다.');
      if (callback) callback();
    } catch {
      showToast('❌ 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleGoToSite = () => {
    if (job?.url) {
      window.open(job.url, '_blank', 'noopener,noreferrer');
    } else {
      showToast('연결된 공고 주소가 없습니다.');
    }
  };

  const handleApplyClick = (onModalOpen: () => void, onModalClose: () => void) => {
    if (isApplied) {
      onModalClose();
      navigate(PATH.STATUS);
      return;
    }
    if (!isLoggedIn) {
      showToast('지원하기는 로그인 후 이용할 수 있어요', true);
      return;
    }
    onModalOpen();
  };

  const handleScrapModalConfirm = () => {
    if (scrapModalMode === 'confirm') {
      handleConfirmScrap();
    } else {
      if (scrapModalContent.confirmText === '로그인하러 가기') {
        navigate(PATH.AUTH || '/auth');
      } else {
        navigate(PATH.SCRAP || '/scrap');
      }
      setIsScrapModalOpen(false);
    }
  };

  const handleScrapModalClose = () => {
    setIsScrapModalOpen(false);
    setTimeout(() => queryClient.invalidateQueries({ queryKey: ['scraps', 'all'] }), 50);
  };

  return {
    isScrapped,
    isApplied,
    handleScrapClick,
    handleEdit,
    handleDeleteClick,
    handleConfirmDelete,
    handleGoToSite,
    handleApplyClick,
    handleScrapModalConfirm,
    handleScrapModalClose,
    states: {
      isEditModalOpen,
      setIsEditModalOpen,
      isDeleteModalOpen,
      setIsDeleteModalOpen,
      isScrapModalOpen,
      setIsScrapModalOpen,
      scrapModalMode,
      scrapModalContent,
    },
  };
};
