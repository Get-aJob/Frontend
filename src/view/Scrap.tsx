import { useEffect, useState, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { getMyScraps, toggleScrap, type ScrapItem } from '@/api/Scrap';
import ScrapHeader from '@/components/scrap/ScrapHeader';
import ScrapList from '@/components/scrap/ScrapList';
import { LoaderCircle, Bookmark } from 'lucide-react';
import EmptyState from '@/components/common/UI/EmptyState';

const Scrap = () => {
  const [scraps, setScraps] = useState<ScrapItem[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'deadline'>('latest');
  const [isLoading, setIsLoading] = useState(true);

  const fetchScraps = async () => {
    try {
      const data = await getMyScraps();
      setScraps(data);
    } catch (error: unknown) {
      console.error('스크랩 목록 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScraps();
  }, []);

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

  const sortedScraps = useMemo(() => {
    const list = [...scraps];
    if (sortBy === 'latest') {
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      return list.sort((a, b) => {
        // ✨ 에러 방지: deadline이 없는 경우 빈 문자열 처리
        const deadlineA = a.deadline || '';
        const deadlineB = b.deadline || '';

        const isAlwaysA = deadlineA === '상시채용' || deadlineA.includes('상시');
        const isAlwaysB = deadlineB === '상시채용' || deadlineB.includes('상시');

        // ✨ 핵심 수정: 두 항목이 모두 상시채용일 경우 순서를 유지(0)
        if (isAlwaysA && isAlwaysB) return 0;
        if (isAlwaysA) return 1; // A가 상시채용이면 뒤로 보냄
        if (isAlwaysB) return -1; // B가 상시채용이면 뒤로 보냄

        // 정상적인 날짜 비교
        const timeA = new Date(deadlineA).getTime();
        const timeB = new Date(deadlineB).getTime();

        // 날짜 파싱이 불가능한 예외 케이스 처리 (NaN)
        if (isNaN(timeA) && isNaN(timeB)) return 0;
        if (isNaN(timeA)) return 1;
        if (isNaN(timeB)) return -1;

        // 마감일이 가까운 순(오름차순) 정렬
        return timeA - timeB;
      });
    }
  }, [scraps, sortBy]);

  return (
    <div className="flex flex-col gap-8">
      <ScrapHeader count={scraps.length} sortBy={sortBy} onSortChange={handleSortChange} />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40 text-gray-400">
          <LoaderCircle size={36} className="animate-spin text-btn-point mb-4" />
          <p className="font-medium tracking-wide">저장된 공고를 불러오는 중입니다...</p>
        </div>
      ) : scraps.length > 0 ? (
        <div className="w-full">
          <ScrapList
            scraps={sortedScraps}
            onUnscrap={handleUnscrap}
            onApplySuccess={handleApplySuccess}
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
