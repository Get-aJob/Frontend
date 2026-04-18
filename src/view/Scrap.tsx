import { useState } from 'react';
import type { ChangeEvent } from 'react';

import ScrapHeader from '@/components/scrap/ScrapHeader';
import ScrapList from '@/components/scrap/ScrapList';
import { LoaderCircle, Bookmark } from 'lucide-react';
import EmptyState from '@/components/common/UI/EmptyState';
import Pagination from '@/components/Posting/Pagination';
import { useMyScraps, useToggleScraps } from '@/hooks/useScraps';
import { useQueryClient } from '@tanstack/react-query';

const Scrap = () => {
  const [sortBy, setSortBy] = useState<'latest' | 'deadline'>('latest');
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 30;
  const queryClient = useQueryClient();
  const { data, isLoading } = useMyScraps(currentPage, PAGE_SIZE, sortBy);
  const { mutate } = useToggleScraps();
  const totalPage = data ? Math.ceil(data?.pagination.totalCount / PAGE_SIZE) : 1;
  const totalCount = data ? data.pagination.totalCount : 0;

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
  };

  const onClose = async () => {
    queryClient.invalidateQueries({ queryKey: ['scraps'] });
  };

  const handleUnscrap = async (id: string) => {
    mutate(id);
  };

  const handleApplySuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['scraps'] });
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
      ) : data!.scraps.length > 0 ? (
        <div className="w-full">
          <ScrapList
            scraps={data!.scraps}
            onUnscrap={handleUnscrap}
            onApplySuccess={handleApplySuccess}
            onClose={onClose}
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
