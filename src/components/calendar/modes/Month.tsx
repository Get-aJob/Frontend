import React from 'react';
import type { ScheduleEvent } from '@/types/Calendar';

interface MonthProps {
  currentDate: Date;
  events: ScheduleEvent[];
  onEventClick: (event: ScheduleEvent) => void;
  onMoreClick: (date: string) => void;
}

const Month: React.FC<MonthProps> = ({ currentDate, events, onEventClick, onMoreClick }) => {
  // ✨ 에러 해결: utils/time 대신 컴포넌트 내부에서 달력 그리드용 날짜를 직접 계산합니다.
  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // 지난 달 날짜 채우기
    const firstDayOfWeek = firstDayOfMonth.getDay();
    for (let i = firstDayOfWeek; i > 0; i--) {
      days.push({
        date: new Date(year, month, 1 - i),
        isCurrentMonth: false,
      });
    }

    // 이번 달 날짜 채우기
    const daysInMonth = lastDayOfMonth.getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // 다음 달 날짜 채우기
    const lastDayOfWeek = lastDayOfMonth.getDay();
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const days = getMonthDays(currentDate);
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="flex flex-col h-full">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/30">
        {weekDays.map((day, i) => (
          <div
            key={day}
            className={`py-2 text-center text-[10px] sm:text-xs font-black tracking-tighter ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-400'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr overflow-hidden">
        {/* ✨ 타입 에러 해결: dayObj와 i에 명시적으로 타입을 지정했습니다. */}
        {days.map((dayObj: { date: Date; isCurrentMonth: boolean }, i: number) => {
          // Date 객체에서 현지 시간 기준 YYYY-MM-DD 문자열을 안전하게 추출
          const dateStr = `${dayObj.date.getFullYear()}-${String(dayObj.date.getMonth() + 1).padStart(2, '0')}-${String(dayObj.date.getDate()).padStart(2, '0')}`;
          const dayEvents = events.filter((e) => e.date === dateStr);
          const isToday = new Date().toDateString() === dayObj.date.toDateString();

          return (
            <div
              key={i}
              // ✨ Tailwind 경고 해결: min-h-17.5, sm:min-h-25 사용
              className={`min-h-17.5 sm:min-h-25 p-1 border-r border-b border-slate-50 relative group hover:bg-blue-50/20 transition-colors ${
                !dayObj.isCurrentMonth ? 'bg-slate-50/30 opacity-40' : ''
              }`}
            >
              {/* 날짜 숫자 */}
              <span
                // ✨ Tailwind 경고 해결: text-body 사용
                className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 text-body sm:text-xs font-bold rounded-lg ${
                  isToday ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700'
                }`}
              >
                {dayObj.date.getDate()}
              </span>

              {/* 일정 목록 */}
              <div className="mt-1 space-y-0.5 overflow-hidden">
                {dayEvents.slice(0, 3).map((event, idx) => (
                  <button
                    key={idx}
                    onClick={() => onEventClick(event)}
                    className={`w-full text-left truncate px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold leading-tight transition-all active:scale-95 ${
                      event.eventType === 'applied'
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                    }`}
                  >
                    <span className="sm:hidden">●</span>
                    <span className="hidden sm:inline">{event.title}</span>
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <button
                    onClick={() => onMoreClick(dateStr)}
                    className="w-full text-center text-[9px] font-extrabold text-slate-400 py-0.5 hover:text-slate-600"
                  >
                    +{dayEvents.length - 3}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Month;
