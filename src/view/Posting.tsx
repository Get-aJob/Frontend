import { useEffect, useState } from 'react';
import { usePostingStore } from '@/store/usePostingStore';
import type { ExtendedJobPosting } from '@/store/usePostingStore';
import PostingList from '@/components/Posting/PostingList';
import PostingFilter from '@/components/Posting/PostingFilter';
import Pagination from '@/components/Posting/Pagination';
import EmptyState from '@/components/common/UI/EmptyState';
import PostingDetailModal from '@/components/Posting/PostingDetailModal';
import { Briefcase } from 'lucide-react';

const Posting = () => {
  const {
    postings,
    isLoading,
    fetchPostings,
    totalPages,
    currentPage,
    selectedSite,
    toggleScrapStatus,
    updateViewCount, // 💡 스토어에서 조회수 업데이트 함수 가져오기
  } = usePostingStore();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<ExtendedJobPosting | null>(null);

  useEffect(() => {
    fetchPostings(currentPage, selectedSite);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
    fetchPostings(page, selectedSite);
  };

  const handleDetailOpen = (job: ExtendedJobPosting) => {
    setSelectedJob(job);
    setIsDetailModalOpen(true);

    // 💡 모달이 열릴 때마다 프론트엔드의 조회수 상태를 1 증가시킵니다.
    updateViewCount(job.id);
  };

  const handleDetailClose = () => {
    setIsDetailModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <div className="flex flex-col gap-8">
      <PostingFilter totalCount={postings.length} />
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
                <PostingList
                  postings={postings}
                  onScrap={toggleScrapStatus}
                  onDetail={handleDetailOpen}
                />
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

      {/* 4. 공고 상세 보기 모달 연결 */}
      <PostingDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleDetailClose}
        job={selectedJob}
      />
    </div>
  );
};

export default Posting;
