import type { ScheduleEvent } from '@/types/Calendar';

interface Props {
  currentDate: Date;
  events: ScheduleEvent[];
  onEventClick: (e: ScheduleEvent) => void;
}

const Day = ({ currentDate, events, onEventClick }: Props) => {
  const dayStr = currentDate.toISOString().split('T')[0];
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
          <h2 className="text-3xl font-black text-gray-900">오늘의 채용 일정</h2>
          <p className="text-gray-400 font-bold tracking-widest mt-1">{dayStr}</p>
        </div>
      </div>

      {dayEvents.length > 0 ? (
        dayEvents.map((e, idx) => (
          <div
            key={idx}
            onClick={() => onEventClick(e)}
            className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-black ${e.eventType === 'deadline' ? 'bg-rose-500' : 'bg-emerald-500'}`}
              >
                {e.companyName[0]}
              </div>
              <div>
                <h4 className="text-xl font-black text-gray-900">{e.companyName}</h4>
                <p className="text-gray-400 font-bold">{e.title}</p>
              </div>
            </div>
            <span
              className={`px-5 py-2 rounded-full text-[11px] font-black tracking-widest ${e.eventType === 'deadline' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}
            >
              {e.eventType.toUpperCase()}
            </span>
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
