import { useEffect, useMemo, useState } from 'react';
import { useStatusStore } from '@/store/useStatusStore';
import { LayoutGrid, List } from 'lucide-react';

// 임포트 경로 확인 및 수정
import StatusSummary from '@/components/status/StatusSummary';
import StatusBoard from '@/components/status/StatusBoard';
import StatusList from '@/components/status/StatusList';
import StatusDetailSlide from '@/components/status/StatusDetailSlide';
import EmptyState from '@/components/common/UI/EmptyState';
import { toApplicationItem } from '@/utils/statusUtils';

const Status = () => {
  const [view, setView] = useState<'kanban' | 'list'>('list');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const {
    applications,
    isLoading,
    error,
    fetchApplications,
    fetchApplicationDetail,
    clearApplicationDetail,
  } = useStatusStore();

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const applicationItems = useMemo(() => applications.map(toApplicationItem), [applications]);

  const handleOpenDetail = async (id: string) => {
    setSelectedItemId(id);
    await fetchApplicationDetail(id);
  };

  const handleCloseDetail = () => {
    setSelectedItemId(null);
    clearApplicationDetail();
  };

  if (error) return <div className="p-6 text-status-error">에러 발생: {error}</div>;

  return (
    <div className="p-6 animate-[fadeUp_0.3s_ease]">
      <StatusSummary items={applicationItems} />

      <div className="mt-8 mb-6 inline-flex rounded-xl bg-gray-100 p-1 shadow-inner">
        <button
          onClick={() => setView('kanban')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all cursor-pointer ${
            view === 'kanban'
              ? 'bg-white text-btn-point shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <LayoutGrid size={16} /> 칸반 보드
        </button>
        <button
          onClick={() => setView('list')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all cursor-pointer ${
            view === 'list'
              ? 'bg-white text-btn-point shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <List size={16} /> 리스트
        </button>
      </div>

      {applicationItems.length === 0 && !isLoading ? (
        <EmptyState title="지원 현황이 없습니다." description="관심 있는 공고에 지원해 보세요!" />
      ) : view === 'kanban' ? (
        <StatusBoard items={applicationItems} onOpenDetail={handleOpenDetail} />
      ) : (
        <StatusList items={applicationItems} onOpenDetail={handleOpenDetail} />
      )}

      <StatusDetailSlide isOpen={!!selectedItemId} onClose={handleCloseDetail} />
    </div>
  );
};

export default Status;
