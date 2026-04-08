import { useEffect, useState, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { getMyScraps, toggleScrap, type ScrapItem } from '@/api/Scrap';
import ScrapHeader from '@/components/scrap/ScrapHeader';
import ScrapList from '@/components/scrap/ScrapList';
import { LoaderCircle, Bookmark } from 'lucide-react';
import EmptyState from '@/components/common/UI/EmptyState';
import { useNotificationStore } from '@/store/useNotificationStore';

const Scrap = () => {
  const [scraps, setScraps] = useState<ScrapItem[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'deadline'>('latest');
  const [isLoading, setIsLoading] = useState(true);
  const increaseUnreadCount = useNotificationStore((state) => state.increaseUnreadCount);

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

  // 💡 수정된 부분: alert와 confirm을 제거했습니다.
  // 이제 ScrapCard에서 처리된 후 데이터만 갱신하는 역할을 합니다.
  const handleUnscrap = async (id: string) => {
    try {
      await toggleScrap(id);
      // 낙관적 업데이트: 서버 응답을 기다리지 않고 리스트에서 즉시 제거하여 반응 속도를 높임
      setScraps((prev) => prev.filter((item) => item.jobPostingId !== id));
    } catch (error: unknown) {
      console.error('스크랩 해제 실패:', error);
      // 실패 시 목록을 다시 불러와 상태를 동기화
      fetchScraps();
      throw error; // 에러를 던져서 ScrapCard의 catch 문이 모달 메시지를 띄우게 함
    }
  };

  const handleApplySuccess = (jobId: string) => {
    setScraps((prev) =>
      prev.map((item) => (item.jobPostingId === jobId ? { ...item, isApplied: true } : item)),
    );
    // 동일 클라이언트에서 지원 성공이 확정됐으므로 unread 즉시 +1
    increaseUnreadCount(1);
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
        <div className="flex items-center justify-center py-32 bg-white rounded-[32px] border border-border-light shadow-sm">
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
