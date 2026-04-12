import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { StrictModeDroppable } from './StrictModeDroppable';
import type { ApplicationRecord } from '@/types/Status';
import { useStatusStore } from '@/store/useStatusStore';

interface StatusListProps {
  statusId: string;
  items: ApplicationRecord[];
}

const StatusList: React.FC<StatusListProps> = ({ statusId, items }) => {
  const { setSelectedApplication } = useStatusStore();

  if (!statusId) return null;

  // ✨ 시간대 오차 없는 날짜 포맷 함수
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '날짜 미상';
    const d = new Date(dateString);
    // 한국 시간(KST) 기준으로 'M월 D일' 출력
    return d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
  };

  return (
    <StrictModeDroppable droppableId={statusId}>
      {(provided, snapshot) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          className={`flex flex-col gap-3 min-h-[400px] w-full rounded-2xl p-1 transition-colors ${
            snapshot.isDraggingOver ? 'bg-blue-50/50' : ''
          }`}
        >
          {items.map((item, index) => {
            const dragId = String(item.id);
            return (
              <Draggable key={dragId} draggableId={dragId} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => setSelectedApplication(item)}
                    className={`bg-white p-4 rounded-2xl border shadow-sm transition-all cursor-pointer ${
                      snapshot.isDragging
                        ? 'border-blue-400 shadow-xl ring-2 ring-blue-100 rotate-2 z-50'
                        : 'border-gray-100 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] sm:text-[11px] font-extrabold text-blue-500 uppercase tracking-tight">
                        {item.jobPostings?.companyName || '회사명 없음'}
                      </span>
                      <h4 className="text-[14px] sm:text-[15px] font-bold text-gray-900 leading-snug line-clamp-2">
                        {item.jobPostings?.title || '공고 제목 없음'}
                      </h4>

                      {/* ✨ 날짜 표시 로직 수정: 캘린더와 동일하게 appliedAt을 가장 먼저 확인합니다. */}
                      <div className="mt-2 flex items-center text-[10px] sm:text-[11px] font-semibold text-gray-400">
                        <span className="mr-1.5">📅</span>
                        {formatDate(item.appliedAt || item.statusChangedAt || item.createdAt)}
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </div>
      )}
    </StrictModeDroppable>
  );
};

export default StatusList;
