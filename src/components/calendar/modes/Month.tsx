import type { ScheduleEvent } from '@/types/Calendar';
import CalendarCell from '@/components/calendar/CalendarCell';

interface Props {
  currentDate: Date;
  events: ScheduleEvent[];
  onEventClick: (e: ScheduleEvent) => void;
}

const Month = ({ currentDate, events, onEventClick }: Props) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(
      <div
        key={`empty-${i}`}
        className="min-h-37.5 bg-gray-50/20 border-r border-b border-border-light"
      />,
    );
  }

  for (let d = 1; d <= lastDate; d++) {
    const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    cells.push(
      <CalendarCell
        key={d}
        date={d}
        fullDate={fullDate}
        isCurrentMonth={true}
        events={events.filter((e) => e.date === fullDate)}
        onEventClick={onEventClick}
      />,
    );
  }

  return (
    <div className="border-t border-l border-border-light rounded-3xl overflow-hidden shadow-sm">
      <div className="grid grid-cols-7 bg-gray-50/50 border-b border-border-light">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
          <div
            key={day}
            className="py-4 text-[11px] font-black text-gray-400 text-center tracking-[0.2em]"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">{cells}</div>
    </div>
  );
};

export default Month;
