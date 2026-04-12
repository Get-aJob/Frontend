import React, { useEffect } from 'react';
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { useStatusStore } from '@/store/useStatusStore';
import { useNotificationStore } from '@/store/useNotificationStore';
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
      const now = new Date().toISOString();

      // ✨ 상태 변경 시 캘린더 날짜(appliedAt)와 카드 날짜(statusChangedAt)를 모두 갱신
      await updateApplication(draggableId, {
        statusId: destination.droppableId,
        appliedAt: now,
        statusChangedAt: now,
      });

      await fetchData();
      void useNotificationStore.getState().syncUnreadCount();
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
      <div className="flex gap-6 overflow-x-auto min-h-[calc(100vh-320px)] items-start scrollbar-hide pb-10">
        {statuses.map((status) => {
          const columnApps = applications.filter(
            (app) => String(app.statusId) === String(status.id),
          );

          return (
            <div
              key={status.id}
              className="flex flex-col min-w-[320px] max-w-[320px] bg-white rounded-[24px] p-5 border border-border-light shadow-sm"
            >
              <div className="flex justify-between items-center mb-6 px-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <h3 className="font-bold text-slate-800 text-lg tracking-tight">
                    {status.displayName}
                  </h3>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    {columnApps.length}
                  </span>
                </div>
              </div>

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
