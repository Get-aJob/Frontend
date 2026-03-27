import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginTop: '32px',
    paddingBottom: '20px',
  },
  btn: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    border: '1px solid #e8eaf0',
    backgroundColor: '#ffffff',
    color: '#6b7280',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  activeBtn: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    borderColor: '#4f46e5',
  },
  disabledBtn: {
    opacity: 0.5,
    pointerEvents: 'none' as const,
  },
};

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  const pageLimit = 5;
  // 소수점 버림을 이용하여 현재 속한 5개 단위의 시작 페이지 계산 (예: 1~5면 시작은 1, 6~10이면 시작은 6)
  const startPage = Math.floor((currentPage - 1) / pageLimit) * pageLimit + 1;
  const endPage = Math.min(startPage + pageLimit - 1, totalPages);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div style={styles.container}>
      {/* 이전 블록(5장 뒤로) 이동 화살표 */}
      <button
        style={{ ...styles.btn, ...(startPage === 1 ? styles.disabledBtn : {}) }}
        onClick={() => onPageChange(startPage - 1)}
      >
        ❮
      </button>

      {pages.map((page) => (
        <button
          key={page}
          style={page === currentPage ? { ...styles.btn, ...styles.activeBtn } : styles.btn}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* 다음 블록(5장 앞으로) 이동 화살표 */}
      <button
        style={{ ...styles.btn, ...(endPage === totalPages ? styles.disabledBtn : {}) }}
        onClick={() => onPageChange(endPage + 1)}
      >
        ❯
      </button>
    </div>
  );
};

export default Pagination;
