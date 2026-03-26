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
            className={`p-6 rounded-4xl border transition-all ${isToday ? 'bg-indigo-50/30 border-indigo-100 ring-1 ring-indigo-50' : 'bg-white border-gray-100'}`}
          >
            <div className="flex flex-col items-center mb-8">
              <span
                className={`text-[11px] font-black tracking-widest mb-2 ${isToday ? 'text-indigo-600' : 'text-gray-300'}`}
              >
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][i]}
              </span>
              <span
                className={`text-2xl font-black ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}
              >
                {day.getDate()}
              </span>
            </div>
            <div className="space-y-3">
              {events
                .filter((e) => e.date === dateStr)
                .map((e, idx) => {
                  const isPastDeadline = e.eventType === 'deadline' && e.date < todayStr;
                  const colorClasses =
                    e.eventType === 'applied'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : isPastDeadline
                        ? 'bg-gray-100 text-gray-400 border-gray-200 opacity-60'
                        : 'bg-rose-50 text-rose-700 border-rose-100';

                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => onEventClick(e)}
                      className={`${colorClasses} w-full text-left p-4 rounded-2xl shadow-sm border cursor-pointer hover:scale-105 transition-all`}
                    >
                      <p className="text-xs font-black truncate">
                        {isPastDeadline && <span className="mr-1">[종료]</span>}
                        {e.companyName}
                      </p>
                      <p
                        className={`text-[10px] font-bold truncate mt-1 ${isPastDeadline ? 'text-gray-400' : 'opacity-70'}`}
                      >
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
