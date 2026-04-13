import React from 'react';
import Month from './modes/Month';
import Week from './modes/Week';
import Day from './modes/Day';
import type { ScheduleEvent, ViewType } from '@/types/Calendar';

interface CalendarGridProps {
  view: ViewType;
  currentDate: Date;
  events: ScheduleEvent[];
  onEventClick: (event: ScheduleEvent) => void;
  onMoreClick: (date: string) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  view,
  currentDate,
  events,
  onEventClick,
  onMoreClick,
}) => {
  return (
    <div className="flex-1 bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-inner-sm">
      {view === 'month' && (
        <Month
          currentDate={currentDate}
          events={events}
          onEventClick={onEventClick}
          onMoreClick={onMoreClick}
        />
      )}
      {view === 'week' && (
        <Week currentDate={currentDate} events={events} onEventClick={onEventClick} />
      )}
      {view === 'day' && (
        <Day currentDate={currentDate} events={events} onEventClick={onEventClick} />
      )}
    </div>
  );
};

export default CalendarGrid;
