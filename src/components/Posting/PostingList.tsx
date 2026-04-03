import React, { useEffect } from 'react';
import { usePostingStore } from '@/store/usePostingStore';
import { useAuthStore } from '@/store/useAuthStore';
import PostingCard from './PostingCard';
import Pagination from './Pagination';

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px',
    marginTop: '20px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    gridColumn: '1 / -1',
  },
  errorMsg: {
    color: '#f43f5e',
    textAlign: 'center' as const,
    gridColumn: '1 / -1',
    padding: '20px',
  },
  emptyState: {
    textAlign: 'center' as const,
    color: '#6b7280',
    gridColumn: '1 / -1',
    padding: '40px',
  },
  loginRequired: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
    color: '#6b7280',
    fontSize: '16px',
    fontWeight: 500,
    gridColumn: '1 / -1',
  },
  animations: `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
};

const PostingList: React.FC = () => {
  const { postings, currentPage, totalPages, isLoading, error, fetchPostings, sourceType } =
    usePostingStore();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    // 스토어의 현재 상태를 기준으로 초기 로드
    fetchPostings(currentPage);
  }, [fetchPostings, currentPage, isLoggedIn]);

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;

    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });

    fetchPostings(page);
  };

  if (error) {
    return <div style={styles.errorMsg}>Error: {error}</div>;
  }

  return (
    <>
      <style>{styles.animations}</style>
      <div
        style={{
          ...styles.grid,
          animation: !isLoading ? 'fadeIn 0.4s ease-out' : 'none',
        }}
      >
        {isLoading ? (
          <div style={styles.loadingContainer}>공고를 불러오는 중입니다...</div>
        ) : !isLoggedIn && sourceType !== 'auto' ? (
          <div style={styles.loginRequired}>로그인 후 이용가능합니다.</div>
        ) : postings?.length > 0 ? (
          postings.map((job) => <PostingCard key={job.id} job={job} />)
        ) : (
          <div style={styles.emptyState}>등록된 공고가 없습니다.</div>
        )}
      </div>

      {!isLoading && postings?.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default PostingList;
