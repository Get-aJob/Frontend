import JobModal from '@/components/jobPostForm/JobModal';
import ConfirmModal from '@/components/common/UI/ConfirmModal';
import type { JobPosting } from '@/types/Posting';

interface JobActionsModalsProps {
  job: JobPosting | null;
  states: {
    isEditModalOpen: boolean;
    setIsEditModalOpen: (open: boolean) => void;
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: (open: boolean) => void;
    isScrapModalOpen: boolean;
    setIsScrapModalOpen: (open: boolean) => void;
    scrapModalMode: 'confirm' | 'success';
    scrapModalContent: {
      title: string;
      message: string;
      confirmText: string;
    };
  };
  onConfirmDelete: () => void;
  onScrapConfirm: () => void;
  onScrapClose: () => void;
  isNested?: boolean;
}

const JobActionsModals = ({
  job,
  states,
  onConfirmDelete,
  onScrapConfirm,
  onScrapClose,
  isNested = false,
}: JobActionsModalsProps) => {
  if (!job) return null;

  return (
    <>
      <JobModal
        isOpen={states.isEditModalOpen}
        onClose={() => states.setIsEditModalOpen(false)}
        mode="edit"
        initialData={job}
        isNested={isNested}
      />

      <ConfirmModal
        isOpen={states.isDeleteModalOpen}
        title="공고 삭제"
        message="이 공고를 정말 삭제하시겠습니까?"
        confirmText="삭제하기"
        cancelText="취소"
        isDanger={true}
        onConfirm={onConfirmDelete}
        onClose={() => states.setIsDeleteModalOpen(false)}
        isNested={isNested}
      />

      <ConfirmModal
        isOpen={states.isScrapModalOpen}
        title={states.scrapModalContent.title}
        message={states.scrapModalContent.message}
        confirmText={states.scrapModalContent.confirmText}
        cancelText={states.scrapModalMode === 'confirm' ? '취소' : '닫기'}
        isDanger={states.scrapModalMode === 'confirm'}
        onConfirm={onScrapConfirm}
        onClose={onScrapClose}
        isNested={isNested}
      />
    </>
  );
};

export default JobActionsModals;
