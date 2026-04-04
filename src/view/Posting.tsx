// src/view/Posting.tsx
import { useEffect } from 'react';
import { usePostingStore } from '@/store/usePostingStore';
import PostingList from '@/components/Posting/PostingList';
import PostingFilter from '@/components/Posting/PostingFilter';
import Pagination from '@/components/Posting/Pagination';
import EmptyState from '@/components/common/UI/EmptyState';
import PostingNotice from '@/components/Posting/PostingNotice';
import { Briefcase } from 'lucide-react';

const Posting = () => {
  const { postings, isLoading, fetchPostings, totalPages, sourceType, currentPage, selectedSite } =
    usePostingStore(); //

  useEffect(() => {
    fetchPostings(currentPage, selectedSite);
  }, [currentPage, sourceType, selectedSite, fetchPostings]); //

  const handlePageChange = (page: number) => {
    fetchPostings(page, selectedSite);
  }; //

  const handlePageReset = () => {
    handlePageChange(1);
  }; //

  // ... 상단 import 생략

  return (
    <div className="animate-[fadeUp_0.3s_ease] pb-20">
      <PostingFilter totalCount={postings.length} onPageReset={handlePageReset} />

      <PostingNotice />

      <div className="mt-8">
        {/* 1. 로딩 중일 때는 무조건 스켈레톤만! */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-50 animate-pulse rounded-2xl border border-gray-100"
              />
            ))}
          </div>
        ) : (
          <>
            {postings.length > 0 ? (
              <>
                <PostingList postings={postings} />
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center py-20">
                <EmptyState
                  icon={<Briefcase size={44} />}
                  title="현재 등록된 공고가 없습니다"
                  description="잠시 후 다시 확인하거나, 새로운 공고를 직접 등록해보세요."
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Posting;
