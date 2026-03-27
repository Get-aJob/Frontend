import React from 'react';

interface PostingActionButtonsProps {
  url?: string;
}

const styles = {
  buttonGroup: {
    display: 'flex',
    gap: '8px',
    minWidth: '170px', // 두 버튼의 넓이를 고정하기 위해 부모 너비 설정
  },
  btn: {
    flex: 1, // 컨테이너 공간을 똑같이 절반씩 나눠 가짐
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
  applyBtn: {
    border: '1.5px solid #4f46e5',
    background: '#4f46e5',
    color: '#fff',
  },
};

const PostingActionButtons: React.FC<PostingActionButtonsProps> = ({ url }) => {
  const handleScrapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert('스크랩 기능이 개발 중입니다!');
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

  return (
    <div style={styles.buttonGroup}>
      <button style={{ ...styles.btn, ...styles.scrapBtn }} onClick={handleScrapClick}>
        ★ 스크랩
      </button>
      <button style={applyBtnStyle} onClick={handleApplyClick}>
        지원하기
      </button>
    </div>
  );
};

export default PostingActionButtons;
