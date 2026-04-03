import React, { useState } from 'react';
import { toggleScrap } from '@/api/Scrap';
import { usePostingStore } from '@/store/usePostingStore';
import JobModal from '@/components/jobPostForm/JobModal';
import type { JobPosting } from '@/types/Posting';

interface PostingActionButtonsProps {
  job: JobPosting & { isScrapped?: boolean; sourceType?: string; externalId?: string };
}

const styles = {
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    minWidth: '170px',
    flexWrap: 'wrap' as const,
    flex: '1 1 auto',
  },
  btn: {
    flex: 1,
    padding: '8px 0',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    textAlign: 'center' as const,
    border: '1.5px solid transparent',
  },
  scrapBtn: {
    border: '1.5px solid #fbd38d',
    background: '#fffaf0',
    color: '#d97706',
  },
  scrapBtnActive: {
    border: '1.5px solid #d97706',
    background: '#d97706',
    color: '#ffffff',
  },
  applyBtn: {
    border: '1.5px solid #4f46e5',
    background: '#4f46e5',
    color: '#fff',
  },
  editBtn: {
    border: '1.5px solid #cbd5e1',
    background: '#f8fafc',
    color: '#475569',
  },
  deleteBtn: {
    border: '1.5px solid #fecaca',
    background: '#fff1f1',
    color: '#dc2626',
  },
};

const PostingActionButton: React.FC<PostingActionButtonsProps> = ({ job }) => {
  const { toggleScrapStatus, deleteJob } = usePostingStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleScrapClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const result = await toggleScrap(String(job.id));
      toggleScrapStatus(job.id);

      if (result.added) {
        alert('공고가 스크랩되었습니다. 스크랩 페이지에서 확인하세요!');
      } else {
        alert('스크랩이 해제되었습니다.');
      }
    } catch (error: unknown) {
      console.error(error);
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        alert('로그인이 필요한 기능입니다. 로그인 후 이용해주세요.');
      } else {
        alert('스크랩 처리에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!job.url) {
      alert('이동할 수 있는 지원 공고 주소가 없습니다.');
      return;
    }
    window.open(job.url, '_blank', 'noopener,noreferrer');
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!job.externalId) return;
    if (window.confirm('정말 이 공고를 삭제하시겠습니까?')) {
      try {
        await deleteJob(job.externalId, job.sourceType);
        alert('공고가 삭제되었습니다.');
      } catch (error: unknown) {
        console.error(error);
        const err = error as { response?: { status?: number } };
        if (err.response?.status === 401) {
          alert('로그인이 필요한 기능입니다. 로그인 후 이용해주세요.');
        } else if (err.response?.status === 0 || err.response?.status === undefined) {
          alert('네트워크 오류가 발생했습니다. 연결을 확인해주세요.');
        } else {
          alert('삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      }
    }
  };

  const isManual = job.sourceType === 'manual' || job.sourceType === 'direct';

  const applyBtnStyle = job.url
    ? { ...styles.btn, ...styles.applyBtn }
    : {
        ...styles.btn,
        ...styles.applyBtn,
        background: '#e5e7eb',
        borderColor: '#d1d5db',
        color: '#9ca3af',
        cursor: 'not-allowed',
      };

  const currentScrapStyle = job.isScrapped
    ? { ...styles.btn, ...styles.scrapBtnActive }
    : { ...styles.btn, ...styles.scrapBtn };

  return (
    <>
      <div style={{ ...styles.buttonGroup, minWidth: isManual ? '240px' : '170px' }}>
        {isManual && (
          <>
            <button style={{ ...styles.btn, ...styles.editBtn }} onClick={handleEditClick}>
              수정
            </button>
            <button style={{ ...styles.btn, ...styles.deleteBtn }} onClick={handleDeleteClick}>
              삭제
            </button>
          </>
        )}
        <button style={currentScrapStyle} onClick={handleScrapClick}>
          {job.isScrapped ? '★ 저장됨' : '☆ 스크랩'}
        </button>
        <button style={applyBtnStyle} onClick={handleApplyClick}>
          지원하기
        </button>
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

export default PostingActionButton;
