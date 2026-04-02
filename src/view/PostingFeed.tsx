import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePostingStore } from '@/store/usePostingStore';
import Pagination from '@/components/Posting/Pagination';
import { PATH } from '@/router/Path';

const PostingFeed = () => {
  const { postings, currentPage, totalPages, isLoading, error, fetchPostings } = usePostingStore();
  const navigate = useNavigate();

  useEffect(() => {
    // 스토어의 현재 상태를 기준으로 초기 로드
    fetchPostings(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPostings]); // 마운트 시 또는 fetchPostings가 변경될 때만 실행 (페이지 변경은 handlePageChange가 처리)

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;

    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });

    fetchPostings(page);
  };

  const handleCardClick = (jobId: string | number) => {
    navigate(PATH.POSTING_FEED_DETAIL.replace(':jobId', String(jobId)));
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f4f5f8] p-6">
      <div className="mb-[18px] flex items-center gap-[14px] rounded-xl border-[1.5px] border-[#c7d2fe] bg-gradient-to-br from-[#eef2ff] to-[#f5f3ff] px-[18px] py-[14px]">
        <div className="flex items-center gap-2 text-[13px] font-bold text-[#111827]">
          <RefreshCw size={14} color="#4f46e5" />
          <span>6시간 마다 채용 공고 크롤링</span>
        </div>
      </div>

      <div>
        <h1></h1>
      </div>

      {isLoading ? (
        <div>공고를 불러오는 중입니다...</div>
      ) : postings?.length > 0 ? (
        <div className="mt-3 flex flex-col gap-3">
          {postings.map((job) => (
            <div
              key={job.id}
              className="flex cursor-pointer items-center gap-4 rounded-2xl border border-[#e8eaf0] bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              onClick={() => handleCardClick(job.id)}
            >
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  className="h-12 w-12 shrink-0 rounded-xl border border-[#f3f4f6] bg-white object-contain"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#4ade80] text-lg font-extrabold text-white">
                  {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
                </div>
              )}

              <div className="min-w-0 text-base font-semibold text-[#111827] truncate">
                {job.companyName}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>등록된 공고가 없습니다.</div>
      )}

      {!isLoading && postings?.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default PostingFeed;
