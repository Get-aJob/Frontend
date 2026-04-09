import type { ScheduleEvent } from '@/types/Calendar';

interface Props {
  currentDate: Date;
  events: ScheduleEvent[];
  onEventClick: (e: ScheduleEvent) => void;
}

const Day = ({ currentDate, events, onEventClick }: Props) => {
  const toLocalDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const dayStr = toLocalDateStr(currentDate);
  const dayEvents = events.filter((e) => e.date === dayStr);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-6 mb-12">
        <div className="w-20 h-20 bg-gray-900 rounded-[28px] flex flex-col items-center justify-center text-white shadow-xl">
          <span className="text-xs font-black opacity-50 uppercase">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][currentDate.getDay()]}
          </span>
          <span className="text-3xl font-black">{currentDate.getDate()}</span>
        </div>
        <div>
          <h2 className="text-title font-black text-gray-900">오늘의 채용 일정</h2>
          <p className="text-body text-gray-400 font-bold tracking-widest mt-1">{dayStr}</p>
        </div>
      </div>

      {dayEvents.length > 0 ? (
        dayEvents.map((e, idx) => (
          <div
            key={idx}
            onClick={() => onEventClick(e)}
            className="bg-white p-8 rounded-4xl border border-border-light shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black shrink-0 overflow-hidden ${
                  e.companyLogo
                    ? 'bg-white border border-border-light'
                    : e.eventType === 'applied'
                      ? 'bg-emerald-500'
                      : e.sourceType === 'auto'
                        ? 'bg-blue-500'
                        : 'bg-rose-500'
                }`}
              >
                {e.companyLogo ? (
                  <img
                    src={e.companyLogo}
                    alt={e.companyName}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  e.companyName[0]
                )}
              </div>

              <div>
                <h4 className="text-subtitle font-black text-gray-900">{e.companyName}</h4>
                <p className="text-body text-gray-400 font-bold">{e.title}</p>
              </div>
            </div>

            {e.eventType === 'applied' ? (
              <span className="text-xs font-bold px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200">
                {e.statusName || '지원 현황'}
              </span>
            ) : e.sourceType === 'auto' ? (
              <span className="text-xs font-bold px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-200">
                자동 공고
              </span>
            ) : (
              <span className="text-xs font-bold px-3 py-1.5 rounded-md bg-rose-50 text-rose-600 border border-rose-200">
                수동 공고
              </span>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-20 bg-gray-50/50 rounded-4xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold">등록된 일정이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default Day;
