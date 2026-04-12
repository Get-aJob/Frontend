import React from 'react';
import type { ScheduleEvent } from '@/types/Calendar';

interface WeekProps {
  currentDate: Date;
  events: ScheduleEvent[];
  onEventClick: (event: ScheduleEvent) => void;
}

const Week: React.FC<WeekProps> = ({ currentDate, events, onEventClick }) => {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="flex flex-col h-full overflow-x-auto scrollbar-hide">
      <div className="flex flex-1 min-w-[600px] sm:min-w-full">
        {days.map((day, i) => {
          const dateStr = day.toISOString().split('T')[0];
          const dayEvents = events.filter((e) => e.date === dateStr);
          const isToday = new Date().toDateString() === day.toDateString();

          return (
            <div key={i} className="flex-1 flex flex-col border-r border-slate-50 last:border-r-0">
              <div
                className={`p-3 text-center border-b border-slate-50 ${isToday ? 'bg-blue-50/50' : ''}`}
              >
                <div className="text-[10px] sm:text-xs font-bold text-slate-400 mb-1">
                  {weekDays[i]}
                </div>
                <div
                  className={`inline-flex w-7 h-7 sm:w-8 sm:h-8 items-center justify-center rounded-xl text-xs sm:text-sm font-black ${
                    isToday ? 'bg-blue-600 text-white' : 'text-slate-800'
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>

              <div className="flex-1 p-2 space-y-2 bg-slate-50/10">
                {dayEvents.map((event, idx) => (
                  <button
                    key={idx}
                    onClick={() => onEventClick(event)}
                    className="w-full text-left p-2 rounded-xl border border-white shadow-sm bg-white hover:border-blue-200 transition-all active:scale-95"
                  >
                    <div className="text-[9px] font-extrabold text-blue-500 mb-0.5">
                      {event.companyName}
                    </div>
                    <div className="text-[11px] font-bold text-slate-800 leading-tight line-clamp-2">
                      {event.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Week;
