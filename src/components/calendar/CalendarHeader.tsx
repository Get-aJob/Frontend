import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ViewType, EventFilterType } from '@/types/Calendar';

interface CalendarHeaderProps {
  view: ViewType;
  setView: (view: ViewType) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  filter: EventFilterType;
  setFilter: (filter: EventFilterType) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  view,
  setView,
  currentDate,
  setCurrentDate,
  filter,
  setFilter,
}) => {
  const formatHeaderDate = () => {
    return currentDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() + (direction === 'prev' ? -1 : 1));
    } else if (view === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'prev' ? -7 : 7));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === 'prev' ? -1 : 1));
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* 날짜 제목 및 이동 */}
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight shrink-0">
            {formatHeaderDate()}
          </h2>
          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
            <button
              onClick={() => navigateDate('prev')}
              className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              // ✨ Tailwind 경고 해결: text-[11px] 대신 text-body 적용
              className="px-3 py-1 text-body font-bold text-slate-700 hover:bg-white hover:shadow-sm rounded-lg transition-all"
            >
              오늘
            </button>
            <button
              onClick={() => navigateDate('next')}
              className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* 뷰 전환 버튼 */}
        <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl w-full sm:w-auto">
          {(['month', 'week', 'day'] as ViewType[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              // ✨ Tailwind 경고 해결: text-[11px] 대신 text-body 적용
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-body sm:text-xs font-bold transition-all ${
                view === v
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {v === 'month' ? '월' : v === 'week' ? '주' : '일'}
            </button>
          ))}
        </div>
      </div>

      {/* 필터 칩 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {(['all', 'applied', 'manual', 'auto'] as EventFilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-extrabold border transition-all shrink-0 ${
              filter === f
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
          >
            {f === 'all'
              ? '전체'
              : f === 'applied'
                ? '지원현황'
                : f === 'manual'
                  ? '수동공고'
                  : '자동공고'}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarHeader;
