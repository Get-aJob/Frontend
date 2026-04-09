import { useEffect, useState, useMemo } from 'react';
import { getSchedules } from '@/api/Schedules';
import type { ScheduleEvent, ViewType, EventFilterType } from '@/types/Calendar';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import CalendarDetailSlide from '@/components/calendar/CalendarDetailSlide';

const Calendar = () => {
  const [view, setView] = useState<ViewType>('month');
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [filter, setFilter] = useState<EventFilterType>('all');

  useEffect(() => {
    let isMounted = true;
    const fetchSchedules = async () => {
      let start = new Date(currentDate);
      let end = new Date(currentDate);
      if (view === 'month') {
        start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      } else if (view === 'week') {
        const day = currentDate.getDay();
        start = new Date(currentDate);
        start.setDate(currentDate.getDate() - day);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
      }
      const startDate = start.toISOString().split('T')[0];
      const endDate = end.toISOString().split('T')[0];
      try {
        const res = await getSchedules({ startDate, endDate });
        if (isMounted && res?.schedules?.events) {
          setEvents(res.schedules.events);
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      }
    };
    fetchSchedules();
    return () => {
      isMounted = false;
    };
  }, [currentDate, view]);

  const filteredEvents = useMemo(() => {
    if (filter === 'all') return events;
    return events.filter((event) => event.eventType === filter);
  }, [events, filter]);

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setIsSlideOpen(true);
  };

  return (
    /* ✨ Layout의 p-8 여백 안에서 꽉 차는 흰색 컨테이너로 변경 */
    <div className="w-full bg-white rounded-4xl shadow-sm p-8 flex flex-col border border-border-light min-h-200">
      <CalendarHeader
        view={view}
        setView={setView}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        filter={filter}
        setFilter={setFilter}
      />

      <div className="flex-1 mt-8 border-t border-gray-50 pt-8">
        <CalendarGrid
          view={view}
          currentDate={currentDate}
          events={filteredEvents}
          onEventClick={handleEventClick}
        />
      </div>

      <CalendarDetailSlide
        isOpen={isSlideOpen}
        event={selectedEvent}
        onClose={() => setIsSlideOpen(false)}
      />
    </div>
  );
};

export default Calendar;
