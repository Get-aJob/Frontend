import type { ScheduleEvent, ViewType } from '@/types/Calendar';
import MonthMode from '@/components/calendar/modes/Month';
import WeekMode from '@/components/calendar/modes/Week';
import DayMode from '@/components/calendar/modes/Day';

interface Props {
  view: ViewType;
  currentDate: Date;
  events: ScheduleEvent[];
  onEventClick: (e: ScheduleEvent) => void;
}

const CalendarGrid = ({ view, currentDate, events, onEventClick }: Props) => {
  if (view === 'month') {
    return <MonthMode currentDate={currentDate} events={events} onEventClick={onEventClick} />;
  }

  if (view === 'week') {
    return <WeekMode currentDate={currentDate} events={events} onEventClick={onEventClick} />;
  }

  return <DayMode currentDate={currentDate} events={events} onEventClick={onEventClick} />;
};

export default CalendarGrid;
