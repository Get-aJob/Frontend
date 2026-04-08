import { useEffect, useState, useMemo } from 'react';
import { usePostingStore } from '@/store/usePostingStore';
import PostingList from '@/components/Posting/PostingList';
import PostingFilter from '@/components/Posting/PostingFilter';
import Pagination from '@/components/Posting/Pagination';
import EmptyState from '@/components/common/UI/EmptyState';
import PostingDetailModal from '@/components/Posting/PostingDetailModal';
import { Briefcase } from 'lucide-react';
import { incrementViewCount } from '@/api/Posting';
import type { ExtendedJobPosting } from '@/store/usePostingStore';

const Posting = () => {
  const {
    postings,
    isLoading,
    fetchPostings,
    totalPages,
    currentPage,
    selectedSite,
    toggleScrapStatus,
    updateViewCount,
  } = usePostingStore();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  // 💡 데이터 객체 대신 ID만 저장하여 스토어와 실시간 동기화 유도
  const [selectedJobId, setSelectedJobId] = useState<string | number | null>(null);

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

  // 💡 상세 모달에 넘겨줄 데이터를 스토어에서 실시간으로 찾음
  // 이렇게 하면 모달이 열린 상태에서 댓글 수가 변해도 모달 UI에 즉시 반영됩니다.
  const selectedJob = useMemo(() => {
    return postings.find((job) => String(job.id) === String(selectedJobId)) || null;
  }, [postings, selectedJobId]);

  const handleDetailOpen = (job: ExtendedJobPosting) => {
    setSelectedJobId(job.id);
    setIsDetailModalOpen(true);

    // 1. 프론트엔드 조회수 상태 즉시 업데이트
    updateViewCount(job.id);

    // 2. 서버에 조회수 증가 요청
    incrementViewCount(job.id);
  };

  const handleDetailClose = () => {
    setIsDetailModalOpen(false);
    setSelectedJobId(null);
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

      <PostingDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleDetailClose}
        job={selectedJob}
      />
    </div>
  );
};

export default Posting;
