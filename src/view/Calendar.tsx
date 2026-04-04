// src/view/Calendar.tsx
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

  // 💡 현재 날짜 정보를 Topbar 등 외부에서 알 수 있게 처리하는 로직이 필요할 수 있습니다.
  // 일단은 본문 내에서 날짜가 사라진 문제를 해결하기 위해 Header를 다시 조정합니다.

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
    <div className="bg-bg-view min-h-screen p-4 md:p-6 relative overflow-hidden">
      <div className="w-full max-w-400 mx-auto bg-white rounded-[32px] shadow-2xl p-6 md:p-10 min-h-[calc(100vh-5rem)] flex flex-col border border-border-light">
        <CalendarHeader
          view={view}
          setView={setView}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          filter={filter}
          setFilter={setFilter}
        />

        <div className="flex-1 mt-10">
          <CalendarGrid
            view={view}
            currentDate={currentDate}
            events={filteredEvents}
            onEventClick={handleEventClick}
          />
        </div>
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
