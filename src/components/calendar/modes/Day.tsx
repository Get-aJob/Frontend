import React from 'react';
import type { ScheduleEvent } from '@/types/Calendar';

interface DayProps {
  currentDate: Date;
  events: ScheduleEvent[];
  onEventClick: (event: ScheduleEvent) => void;
}

const Day: React.FC<DayProps> = ({ currentDate, events, onEventClick }) => {
  const dateStr = currentDate.toISOString().split('T')[0];
  const dayEvents = events.filter((e) => e.date === dateStr);

  const weekDay = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'][
    currentDate.getDay()
  ];

  return (
    <div className="flex flex-col h-full p-4 sm:p-8">
      <div className="mb-6">
        <div className="text-blue-600 font-black text-sm sm:text-base mb-1">{weekDay}</div>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {currentDate.getDate()}일 일정
        </h3>
      </div>

      <div className="flex-1 space-y-4">
        {dayEvents.length > 0 ? (
          dayEvents.map((event, idx) => (
            <button
              key={idx}
              onClick={() => onEventClick(event)}
              className="w-full flex flex-col p-5 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-blue-400 hover:shadow-md transition-all text-left group"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] sm:text-xs font-black text-blue-500 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-widest">
                  {event.companyName}
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {event.eventType === 'applied' ? '지원 상태' : '공고 마감'}
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {event.title}
              </h4>
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-300">
            <div className="text-4xl mb-4">📅</div>
            <p className="font-bold text-sm">해당 날짜에 등록된 일정이 없어요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Day;
