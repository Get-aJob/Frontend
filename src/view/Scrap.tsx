import { useEffect, useState, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { getMyScraps, toggleScrap, type ScrapItem } from '@/api/Scrap';
import ScrapHeader from '@/components/scrap/ScrapHeader';
import ScrapList from '@/components/scrap/ScrapList';
import { LoaderCircle } from 'lucide-react';

const Scrap = () => {
  const [scraps, setScraps] = useState<ScrapItem[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'deadline'>('latest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScraps = async () => {
      try {
        const data = await getMyScraps();
        setScraps(data);
      } catch (error) {
        console.error('스크랩 목록 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchScraps();
  }, []);

  const handleUnscrap = async (id: string) => {
    if (!window.confirm('스크랩을 해제하시겠습니까?')) return;
    try {
      await toggleScrap(id);
      setScraps((prev) => prev.filter((item) => item.jobPostingId !== id));
    } catch {
      alert('스크랩 해제에 실패했습니다.');
    }
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
        if (a.deadline === '상시채용' || a.deadline.includes('상시')) return 1;
        if (b.deadline === '상시채용' || b.deadline.includes('상시')) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    }
  }, [scraps, sortBy]);

  return (
    <div className="max-w-7xl mx-auto pb-20 pt-6 px-4 sm:px-6 animate-[fadeUp_0.3s_ease]">
      <ScrapHeader count={scraps.length} sortBy={sortBy} onSortChange={handleSortChange} />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-100 text-gray-400">
          <LoaderCircle size={36} className="animate-spin text-btn-point mb-4" />
          <p className="font-medium tracking-wide">저장된 공고를 불러오는 중입니다...</p>
        </div>
      ) : (
        <ScrapList scraps={sortedScraps} onUnscrap={handleUnscrap} />
      )}
    </div>
  );
};

export default Scrap;
