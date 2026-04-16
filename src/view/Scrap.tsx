import { useEffect, useState, useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { getMyScraps, toggleScrap, type ScrapItem } from '@/api/Scrap';
import ScrapHeader from '@/components/scrap/ScrapHeader';
import ScrapList from '@/components/scrap/ScrapList';
import { LoaderCircle, Bookmark } from 'lucide-react';
import EmptyState from '@/components/common/UI/EmptyState';
import Pagination from '@/components/Posting/Pagination';

const Scrap = () => {
  const [scraps, setScraps] = useState<ScrapItem[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'deadline'>('latest');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  const PAGE_SIZE = 30;

  const fetchScraps = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getMyScraps(currentPage, PAGE_SIZE, sortBy);
      setScraps(data.scraps);
      setTotalCount(data.pagination.totalCount);
      const totalPages = Math.ceil(data.pagination.totalCount / PAGE_SIZE) || 1;
      setTotalPage(totalPages);
    } catch (error: unknown) {
      console.error('스크랩 목록 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, sortBy]);

  useEffect(() => {
    fetchScraps();
  }, [fetchScraps]);

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
  };

  const handleUnscrap = async (id: string) => {
    try {
      await toggleScrap(id);
      setScraps((prev) => prev.filter((item) => item.jobPostingId !== id));
    } catch (error: unknown) {
      console.error('스크랩 해제 실패:', error);
      fetchScraps();
      throw error;
    }
  };

  const handleApplySuccess = (jobId: string) => {
    setScraps((prev) =>
      prev.map((item) => (item.jobPostingId === jobId ? { ...item, isApplied: true } : item)),
    );
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value as 'latest' | 'deadline');
  };

  return (
    <div className="flex flex-col gap-8">
      <ScrapHeader count={totalCount} sortBy={sortBy} onSortChange={handleSortChange} />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40 text-gray-400">
          <LoaderCircle size={36} className="animate-spin text-btn-point mb-4" />
          <p className="font-medium tracking-wide">저장된 공고를 불러오는 중입니다...</p>
        </div>
      ) : scraps.length > 0 ? (
        <div className="w-full">
          <ScrapList
            scraps={scraps}
            onUnscrap={handleUnscrap}
            onApplySuccess={handleApplySuccess}
            setScraps={setScraps}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPage}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center py-32 bg-white rounded-4xl border border-border-light shadow-sm">
          <EmptyState
            icon={<Bookmark size={48} className="text-gray-300" />}
            title="스크랩한 공고가 없습니다"
            description="관심 있는 채용 공고를 스크랩하여 한눈에 모아보세요."
          />
        </div>
      )}
    </div>
  );
};

export default Scrap;
