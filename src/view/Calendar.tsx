import { useEffect, useState } from 'react';
import { getSchedules } from '@/api/Schedules';
import type { ScheduleEvent, ViewType } from '@/types/Calendar';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import CalendarDetailSlide from '@/components/calendar/CalendarDetailSlide';

const Calendar = () => {
  const [view, setView] = useState<ViewType>('month');
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [isSlideOpen, setIsSlideOpen] = useState(false);

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
        start.setDate(currentDate.getDate() - day);
        end.setDate(currentDate.getDate() + (6 - day));
      }

      const startDate = start.toISOString().split('T')[0];
      const endDate = end.toISOString().split('T')[0];

      try {
        const res = await getSchedules({ startDate, endDate });
        if (isMounted) {
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

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setIsSlideOpen(true);
  };

  return (
    <div className="bg-[#f4f5f8] min-h-screen p-4 md:p-6 relative overflow-hidden font-['Noto_Sans_KR']">
      <div className="w-full max-w-400 mx-auto bg-white rounded-4xl shadow-2xl p-6 md:p-10 min-h-[calc(100vh-5rem)] flex flex-col">
        <CalendarHeader
          view={view}
          setView={setView}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
        />

        <div className="flex-1 mt-10">
          <CalendarGrid
            view={view}
            currentDate={currentDate}
            events={events}
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
