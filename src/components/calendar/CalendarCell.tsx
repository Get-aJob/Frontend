import type { ScheduleEvent } from '@/types/Calendar';

interface Props {
  date: number;
  fullDate: string;
  isCurrentMonth: boolean;
  events: ScheduleEvent[];
  onEventClick: (e: ScheduleEvent) => void;
  onMoreClick?: (date: string) => void;
}

const CalendarCell = ({
  date,
  fullDate,
  isCurrentMonth,
  events,
  onEventClick,
  onMoreClick,
}: Props) => {
  const toLocalDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const today = toLocalDateStr(new Date());
  const isToday = fullDate === today;

  const DISPLAY_LIMIT = 2;
  const displayEvents = events.slice(0, DISPLAY_LIMIT);
  const remainingCount = events.length - DISPLAY_LIMIT;

  return (
    <div
      className={`min-h-40 p-2 border-r border-b border-border-light transition-colors hover:bg-gray-50/50 ${!isCurrentMonth ? 'bg-gray-50/20' : 'bg-white'}`}
    >
      <div className="flex justify-between items-start mb-1">
        <span
          className={`
          text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full transition-all
          ${!isCurrentMonth ? 'text-gray-200' : isToday ? 'bg-btn-point text-white shadow-lg' : 'text-gray-700'}
        `}
        >
          {date}
        </span>
      </div>
      <div className="space-y-1">
        {displayEvents.map((e, i) => (
          <div
            key={i}
            onClick={() => onEventClick(e)}
            // ✨ 수동(rose), 자동(blue), 지원(emerald) 색상 적용
            className={`cursor-pointer text-[10px] p-1.5 rounded-xl border shadow-sm transition-all hover:scale-[1.03] ${
              e.eventType === 'applied'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                : e.sourceType === 'auto'
                  ? 'bg-blue-50 text-blue-700 border-blue-100'
                  : 'bg-rose-50 text-rose-700 border-rose-100'
            }`}
          >
            <div className="font-black text-ellipsis-1">{e.companyName}</div>
            <div className="font-bold opacity-70 text-ellipsis-1 mt-[1px]">{e.title}</div>
          </div>
        ))}

        {remainingCount > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onMoreClick) onMoreClick(fullDate);
            }}
            className="w-full text-center text-[10px] font-extrabold text-gray-400 hover:text-gray-600 hover:bg-gray-100 py-1 rounded-lg transition-colors cursor-pointer mt-1"
          >
            +{remainingCount} 더보기
          </button>
        )}
      </div>
    </div>
  );
};

export default CalendarCell;
