// src/components/Posting/PostingActionButtons.tsx
import React from 'react';
import { toggleScrap } from '@/api/Scrap';
import { usePostingStore } from '@/store/usePostingStore';

interface PostingActionButtonsProps {
  url?: string;
  jobId: string | number;
  isScrapped?: boolean;
}

const styles = {
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    minWidth: '170px',
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
};

const PostingActionButtons: React.FC<PostingActionButtonsProps> = ({ url, jobId, isScrapped }) => {
  // 💡 전역 스토어의 토글 함수 가져오기
  const toggleScrapStatus = usePostingStore((state) => state.toggleScrapStatus);

  const handleScrapClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      const result = await toggleScrap(String(jobId));

      // 💡 API 통신 성공 시 스토어의 상태를 즉시 업데이트
      toggleScrapStatus(jobId);

      if (result.added) {
        alert('공고가 스크랩되었습니다. 스크랩 페이지에서 확인하세요!');
      } else {
        alert('스크랩이 해제되었습니다.');
      }
    } catch (error: unknown) {
      console.error('스크랩 처리 중 오류 발생:', error);

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
    if (!url) {
      alert('이동할 수 있는 지원 공고 주소가 없습니다.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const applyBtnStyle = url
    ? { ...styles.btn, ...styles.applyBtn }
    : {
        ...styles.btn,
        ...styles.applyBtn,
        background: '#e5e7eb',
        borderColor: '#d1d5db',
        color: '#9ca3af',
        cursor: 'not-allowed',
      };

  const currentScrapStyle = isScrapped
    ? { ...styles.btn, ...styles.scrapBtnActive }
    : { ...styles.btn, ...styles.scrapBtn };

  return (
    <div style={styles.buttonGroup}>
      <button style={currentScrapStyle} onClick={handleScrapClick}>
        {isScrapped ? '★ 저장됨' : '☆ 스크랩'}
      </button>
      <button style={applyBtnStyle} onClick={handleApplyClick}>
        지원하기
      </button>
    </div>
  );
};

export default PostingActionButtons;
