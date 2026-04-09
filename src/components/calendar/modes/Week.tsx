import type { ScheduleEvent } from '@/types/Calendar';

interface Props {
  currentDate: Date;
  events: ScheduleEvent[];
  onEventClick: (e: ScheduleEvent) => void;
}

const Week = ({ currentDate, events, onEventClick }: Props) => {
  const toLocalDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const todayStr = toLocalDateStr(new Date());
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

  return (
    <div className="grid grid-cols-7 gap-5 h-full">
      {Array.from({ length: 7 }).map((_, i) => {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        const dateStr = toLocalDateStr(day);
        const isToday = dateStr === todayStr;

        return (
          <div
            key={i}
            className={`p-6 rounded-4xl border transition-all ${
              isToday
                ? 'bg-purple-50/30 border-purple-100 ring-1 ring-purple-50'
                : 'bg-white border-border-light'
            }`}
          >
            <div className="flex flex-col items-center mb-8">
              <span
                className={`text-[11px] font-black tracking-widest mb-2 ${isToday ? 'text-btn-point' : 'text-gray-300'}`}
              >
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][i]}
              </span>
              <span
                className={`text-2xl font-black ${isToday ? 'text-btn-point' : 'text-gray-900'}`}
              >
                {day.getDate()}
              </span>
            </div>

            <div className="space-y-3">
              {events
                .filter((e) => e.date === dateStr)
                .map((e, idx) => {
                  // ✨ 카드 전체 색상 적용
                  const colorClasses =
                    e.eventType === 'applied'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : e.sourceType === 'auto'
                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                        : 'bg-rose-50 text-rose-700 border-rose-100';

                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => onEventClick(e)}
                      className={`${colorClasses} w-full text-left p-4 rounded-2xl shadow-sm border cursor-pointer hover:scale-105 transition-all`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-black text-ellipsis-1">{e.companyName}</p>
                        {/* ✨ 자동/수동 뱃지 색상 적용 */}
                        {e.eventType === 'deadline' && (
                          <span
                            className={`text-[9px] font-bold px-1 py-0.5 rounded shrink-0 ${e.sourceType === 'auto' ? 'bg-blue-200/60 text-blue-800' : 'bg-rose-200/60 text-rose-800'}`}
                          >
                            {e.sourceType === 'auto' ? '자동' : '수동'}
                          </span>
                        )}
                        {e.eventType === 'applied' && (
                          <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-emerald-200/50 text-emerald-800 shrink-0 whitespace-nowrap">
                            {e.statusName || '지원 현황'}
                          </span>
                        )}
                      </div>
                      <p className={`text-[10px] font-bold text-ellipsis-1 mt-1 opacity-70`}>
                        {e.title}
                      </p>
                    </button>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Week;
