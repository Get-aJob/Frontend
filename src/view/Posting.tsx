import { useEffect } from 'react';
import { usePostingStore } from '@/store/usePostingStore';
import PostingList from '@/components/Posting/PostingList';
import PostingFilter from '@/components/Posting/PostingFilter';
import Pagination from '@/components/Posting/Pagination';
import EmptyState from '@/components/common/UI/EmptyState';
import PostingNotice from '@/components/Posting/PostingNotice';
import { Briefcase } from 'lucide-react';

const Posting = () => {
  const { postings, isLoading, fetchPostings, totalPages, currentPage, selectedSite } =
    usePostingStore();

  useEffect(() => {
    fetchPostings(currentPage, selectedSite);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    // Layout의 main 스크롤 영역을 상단으로 이동
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
    fetchPostings(page, selectedSite);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 1. 상단 공지/배너 */}
      <PostingNotice />

      {/* 2. 필터 및 전체 개수 (PostingFilter 내부에서 양끝 정렬 처리) */}
      <PostingFilter totalCount={postings.length} />

      {/* 3. 공고 리스트 영역 */}
      <div className="w-full">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-white animate-pulse rounded-2xl border border-border-light shadow-sm"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {postings.length > 0 ? (
              <>
                <PostingList postings={postings} />
                <div className="mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-32 bg-white rounded-4xl border border-border-light shadow-sm">
                <EmptyState
                  icon={<Briefcase size={44} className="text-gray-300" />}
                  title="해당 필터에 등록된 공고가 없습니다"
                  description="다른 사이트를 선택하거나 전체보기를 클릭해주세요."
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Posting;
