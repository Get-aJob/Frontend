import React, { useEffect } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { useStatusStore } from '@/store/useStatusStore';
import { updateApplication } from '@/api/Status';
import StatusList from './StatusList';

const StatusBoard: React.FC = () => {
  const { applications, statuses, fetchData, isLoading } = useStatusStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId && destination.index === source.index)
    )
      return;

    try {
      await updateApplication(draggableId, { statusId: destination.droppableId });
      await fetchData();
    } catch (error) {
      console.error('상태 업데이트 실패:', error);
    }
  };

  if (isLoading && statuses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-400 font-bold">
        보드 데이터를 불러오는 중...
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* ✨ 배경색 bg-[#F8FAFC] 제거 및 투명 처리, p-6 제거하여 Layout 여백 활용 */}
      <div className="flex gap-6 overflow-x-auto min-h-[calc(100vh-320px)] items-start scrollbar-hide pb-10">
        {statuses.map((status) => {
          const columnApps = applications.filter(
            (app) => String(app.statusId) === String(status.id),
          );

          return (
            <div
              key={status.id}
              /* ✨ 컬럼 디자인: 흰색 배경 유지, 테두리와 그림자로 구분감 부여 */
              className="flex flex-col min-w-[320px] max-w-[320px] bg-white rounded-[24px] p-5 border border-border-light shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-6 px-2">
                <div className="flex items-center gap-2.5">
                  {/* 상태 포인트 컬러 점 */}
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                  <h3 className="font-bold text-slate-800 text-lg tracking-tight">
                    {status.displayName}
                  </h3>
                  {/* 개수 뱃지 */}
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    {columnApps.length}
                  </span>
                </div>
              </div>

              {/* 리스트 영역 (Droppable) */}
              <div className="flex-1 min-h-[150px]">
                <StatusList statusId={String(status.id)} items={columnApps} />
              </div>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default StatusBoard;
