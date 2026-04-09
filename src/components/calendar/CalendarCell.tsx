import type { ScheduleEvent } from '@/types/Calendar';

interface Props {
  date: number;
  fullDate: string;
  isCurrentMonth: boolean;
  events: ScheduleEvent[];
  onEventClick: (e: ScheduleEvent) => void;
}

const CalendarCell = ({ date, fullDate, isCurrentMonth, events, onEventClick }: Props) => {
  const today = new Date().toISOString().split('T')[0];
  const isToday = fullDate === today;

  return (
    <div
      className={`min-h-40 p-3 border-r border-b border-border-light transition-colors hover:bg-gray-50/50 ${!isCurrentMonth ? 'bg-gray-50/20' : 'bg-white'}`}
    >
      <div className="flex justify-between items-start mb-3">
        <span
          className={`
          text-xs font-black w-7 h-7 flex items-center justify-center rounded-full transition-all
          ${!isCurrentMonth ? 'text-gray-200' : isToday ? 'bg-btn-point text-white shadow-lg' : 'text-gray-700'}
        `}
        >
          {date}
        </span>
      </div>
      <div className="space-y-2">
        {events.map((e, i) => (
          <div
            key={i}
            onClick={() => onEventClick(e)}
            className={`cursor-pointer text-[10px] p-2 rounded-xl border shadow-sm transition-all hover:scale-[1.03] ${
              e.eventType === 'applied'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                : e.date < today
                  ? 'bg-gray-100 text-gray-400 border-gray-200 opacity-60'
                  : 'bg-rose-50 text-rose-700 border-rose-100'
            }`}
          >
            <div className="font-black text-ellipsis-1">{e.companyName}</div>
            <div className="font-bold opacity-70 text-ellipsis-1 mt-0.5">{e.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarCell;
