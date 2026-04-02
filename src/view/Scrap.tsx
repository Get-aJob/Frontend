import { useEffect, useState, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { getMyScraps, toggleScrap, type ScrapItem } from '@/api/Scrap';
import ScrapHeader from '@/components/scrap/ScrapHeader';
import ScrapList from '@/components/scrap/ScrapList';

const Scrap = () => {
  const [scraps, setScraps] = useState<ScrapItem[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'deadline'>('latest');

  useEffect(() => {
    const fetchScraps = async () => {
      try {
        const data = await getMyScraps();
        setScraps(data);
      } catch (error) {
        console.error('스크랩 목록 로드 실패:', error);
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
    <div className="p-8 bg-[#f4f5f8] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <ScrapHeader count={scraps.length} sortBy={sortBy} onSortChange={handleSortChange} />
        <ScrapList scraps={sortedScraps} onUnscrap={handleUnscrap} />
      </div>
    </div>
  );
};

export default Scrap;
