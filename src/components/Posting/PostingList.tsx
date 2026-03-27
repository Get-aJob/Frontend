import React, { useEffect, useState } from 'react';
import { getPostings } from '@/api/Posting';
import type { JobPosting, BackendJob } from '@/types/Posting';
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
};

const PostingList: React.FC = () => {
  const [postings, setPostings] = useState<JobPosting[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchPostings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getPostings(currentPage, 30); // 3열 * 10행 = 30개씩 요청
        if (isMounted) {
          const rawJobs = data.jobs || (Array.isArray(data) ? data : []);

          const sortedJobs = [...rawJobs].sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA;
          });

          const mappedJobs: JobPosting[] = sortedJobs.map((j: BackendJob) => {
            let finalDeadline = '상시모집';

            if (j.deadline) {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const targetDate = new Date(j.deadline);
              targetDate.setHours(0, 0, 0, 0);

              const diffTime = targetDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              if (diffDays === 0) finalDeadline = 'D-Day';
              else if (diffDays > 0) finalDeadline = `D-${diffDays}`;
              else finalDeadline = `마감 (D+${Math.abs(diffDays)})`;
            } else if (j.deadline_text) {
              if (j.deadline_text.includes('상시')) finalDeadline = '상시모집';
              else finalDeadline = j.deadline_text;
            }

            return {
              id: j.id,
              companyName: j.company_name || 'Unknown',
              companyLogo: j.company_logo,
              title: j.title || 'Untitled',
              url: j.source_url,
              site: j.source_type === 'auto' ? j.source_site_name || '자동크롤링' : '수동등록',
              location: j.location || '전국',
              experienceLevel: j.experience || '경력무관',
              deadline: finalDeadline,
            };
          });

          setPostings(mappedJobs);
          setTotalPages(Math.ceil((data.totalCount || 0) / 30));
        }
      } catch (err: unknown) {
        if (isMounted) {
          const e = err as Error;
          setError(e.message || '데이터 로드 실패');
          console.error('데이터 로드 실패:', e);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPostings();

    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return <div style={styles.errorMsg}>Error: {error}</div>;
  }

  return (
    <>
      <div style={styles.grid}>
        {isLoading ? (
          <div style={styles.loadingContainer}>공고를 불러오는 중입니다...</div>
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
