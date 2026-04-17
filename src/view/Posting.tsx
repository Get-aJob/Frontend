import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePostingStore } from '@/store/usePostingStore';
import PostingList from '@/components/Posting/PostingList';
import PostingFilter from '@/components/Posting/PostingFilter';
import Pagination from '@/components/Posting/Pagination';
import EmptyState from '@/components/common/UI/EmptyState';
import PostingDetailModal from '@/components/Posting/PostingDetailModal';
import SearchBar from '@/components/Posting/SearchBar';
import { Briefcase } from 'lucide-react';
import { incrementViewCount } from '@/api/Posting';
import type { ExtendedJobPosting } from '@/store/usePostingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useStatusStore } from '@/store/useStatusStore';
import { useGetAllScraps } from '@/hooks/scraps';

const Posting = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const { data: scrapData } = useGetAllScraps(isLoggedIn);
  const {
    postings,
    isLoading,
    fetchPostings,
    totalPages,
    totalCount,
    currentPage,
    selectedSite,
    sourceType,
    searchKeyword,
    updateViewCount,
    resetFilters,
    setSearchKeyword,
    setSourceType,
    setSelectedSite,
    setCurrentPage,
  } = usePostingStore();
  const [searchParams] = useSearchParams();
  const keywordFromUrl = searchParams.get('keyword') || '';
  const sourceFromUrl = searchParams.get('source');
  const siteFromUrl = searchParams.get('site') || '';
  const isManualWithoutLogin = !isLoggedIn && sourceType === 'manual';
  const { fetchData, applications } = useStatusStore();

  const appliedJobIds = useMemo(() => {
    return new Set(applications.map((app) => String(app.jobPostingId)));
  }, [applications]);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | number | null>(null);

  // 페이지 진입 및 URL 데이터 동기화 관리
  useEffect(() => {
    // 1. URL 파라미터가 있으면 스토어 상태 동기화
    if (sourceFromUrl === 'auto' || sourceFromUrl === 'manual') {
      setSourceType(sourceFromUrl);
    }
    if (siteFromUrl) {
      setSelectedSite(siteFromUrl);
    }
    if (keywordFromUrl) {
      setSearchKeyword(keywordFromUrl);
    }
  }, [
    keywordFromUrl,
    sourceFromUrl,
    siteFromUrl,
    setSearchKeyword,
    setSourceType,
    setSelectedSite,
  ]);

  // 2. 컴포넌트 언마운트 시에만 필터 초기화 수행
  useEffect(() => {
    return () => {
      resetFilters();
    };
  }, [resetFilters]);

  useEffect(() => {
    fetchPostings(currentPage, selectedSite, searchKeyword, scrapData);
    if (isLoggedIn) {
      fetchData();
    }
  }, [
    isLoggedIn,
    searchKeyword,
    sourceType,
    selectedSite,
    scrapData,
    fetchPostings,
    currentPage,
    fetchData,
  ]);

  const handlePageChange = (page: number) => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // currentPage가 바뀌면 하단 useEffect가 실질적인 fetch를 수행합니다.
    setCurrentPage(page);
  };

  const selectedJob = useMemo(() => {
    return postings.find((job) => String(job.id) === String(selectedJobId)) || null;
  }, [postings, selectedJobId]);

  const handleDetailOpen = async (job: ExtendedJobPosting) => {
    setSelectedJobId(job.id);
    setIsDetailModalOpen(true);
    const viewCount = await incrementViewCount(job.id);
    if (viewCount !== null) {
      updateViewCount(job.id, viewCount);
    }
  };

  const handleDetailClose = () => {
    setIsDetailModalOpen(false);
    setSelectedJobId(null);
  };

  return (
    <div className="flex flex-col gap-5 -mt-2">
      {/* 상단 컨트롤 섹션: 검색 + 필터 통합 */}
      <section className="flex flex-col gap-4 bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <SearchBar />
        <div className="px-1">
          <PostingFilter totalCount={totalCount} />
        </div>
      </section>

      {/* 공고 콘텐츠 영역 */}
      <div className="w-full min-h-125">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-white animate-pulse rounded-3xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {postings.length > 0 ? (
              <>
                <PostingList
                  postings={postings}
                  appliedJobIds={appliedJobIds}
                  onDetail={handleDetailOpen}
                />
                <div className="mt-4 pb-24">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : isManualWithoutLogin ? (
              <div className="flex items-center justify-center py-40">
                <p className="text-gray-400 font-medium text-lg text-center">
                  로그인이 필요한 서비스입니다.
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center py-40 bg-white rounded-[3rem] border border-gray-100 shadow-sm transition-all duration-500 hover:shadow-md">
                <EmptyState
                  icon={<Briefcase size={56} className="text-gray-100" strokeWidth={1} />}
                  title="검색 결과가 없습니다"
                  description={`선택하신 조건에 맞는 공고를 찾을 수 없습니다.\n다른 검색어를 입력해보세요.`}
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
