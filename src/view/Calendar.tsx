import { useEffect, useState, useMemo } from 'react';
import { useSchedules } from '@/hooks/useSchedules';
import { getJobById } from '@/api/Posting';
import { useToastStore } from '@/store/useToastStore';
import { toLocalDateStr } from '@/utils/statusUtils';
import type { ScheduleEvent, ViewType, EventFilterType } from '@/types/Calendar';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import PostingDetailModal from '@/components/Posting/PostingDetailModal';
import StatusDetailSlide from '@/components/status/StatusDetailSlide';
import { usePostingStore, type ExtendedJobPosting } from '@/store/usePostingStore';
import { useStatusStore } from '@/store/useStatusStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { ApplicationRecord } from '@/types/Status'; // ✨ 타입 임포트

const Calendar = () => {
  const { showToast } = useToastStore();
  const [view, setView] = useState<ViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filter, setFilter] = useState<EventFilterType>('all');

  const [selectedJob, setSelectedJob] = useState<ExtendedJobPosting | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✨ any 대신 ApplicationRecord 타입 적용
  const [selectedApplication, setSelectedApplication] = useState<ApplicationRecord | null>(null);
  const [isStatusSlideOpen, setIsStatusSlideOpen] = useState(false);

  const postings = usePostingStore((state) => state.postings);
  const { applications, fetchData: fetchStatusData } = useStatusStore();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn) {
      fetchStatusData();
    }
  }, [fetchStatusData, isLoggedIn]);

  const { startDate, endDate } = useMemo(() => {
    let start = new Date(currentDate);
    let end = new Date(currentDate);
    if (view === 'month') {
      start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 12);
    } else if (view === 'week') {
      const day = currentDate.getDay();
      start = new Date(currentDate);
      start.setDate(currentDate.getDate() - day);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
    }
    return {
      startDate: toLocalDateStr(start),
      endDate: toLocalDateStr(end),
    };
  }, [currentDate, view]);

  const { data: scheduleRes, isError, error } = useSchedules({ startDate, endDate });

  // 일정 데이터 로드 실패 시 에러 처리
  useEffect(() => {
    if (isError) {
      console.error('스케줄 로드 실패:', error);
      showToast('❌ 일정 데이터를 불러오는 데 실패했습니다.');
    }
  }, [isError, error, showToast]);

  const scheduleEvents = useMemo(() => {
    if (!scheduleRes?.schedules?.events) return [];
    return scheduleRes.schedules.events.filter((e) => e.eventType === 'deadline');
  }, [scheduleRes]);

  const combinedEvents = useMemo(() => {
    const appliedEvents: ScheduleEvent[] = applications.map((app) => {
      const dateObj = new Date(app.appliedAt || app.createdAt);
      const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

      return {
        jobPostingId: String(app.jobPostingId),
        type: 'job_post',
        eventType: 'applied',
        title: app.jobPostings?.title || '제목 없음',
        companyName: app.jobPostings?.companyName || '회사명 없음',
        date: dateStr, // 현지 시간 기준 YYYY-MM-DD
        isApplied: true,
        statusName: app.statusName || app.applicationStatuses?.displayName || '지원 현황',
      };
    });

    return [...scheduleEvents, ...appliedEvents];
  }, [scheduleEvents, applications]);

  const filteredEvents = useMemo(() => {
    /*
    const toLocalDateStr = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };
    const todayStr = toLocalDateStr(new Date());
    */

    const validEvents = combinedEvents.filter((e) => {
      if (!isLoggedIn && e.sourceType === 'manual') return false;
      return true;
    });

    if (filter === 'all') return validEvents;
    if (filter === 'manual')
      return validEvents.filter((e) => e.eventType === 'deadline' && e.sourceType === 'manual');
    if (filter === 'auto')
      return validEvents.filter((e) => e.eventType === 'deadline' && e.sourceType === 'auto');
    if (filter === 'applied') return validEvents.filter((e) => e.eventType === 'applied');
    return validEvents;
  }, [combinedEvents, filter, isLoggedIn]);

  const handleEventClick = async (event: ScheduleEvent) => {
    if (event.eventType === 'applied') {
      const appRecord = applications.find(
        (a) => String(a.jobPostingId) === String(event.jobPostingId),
      );
      if (appRecord) {
        setSelectedApplication(appRecord);
        setIsStatusSlideOpen(true);
      }
      return;
    }

    const realJob = postings.find((p) => String(p.id) === String(event.jobPostingId));
    if (realJob) {
      setSelectedJob(realJob);
      setIsModalOpen(true);
      return;
    }

    try {
      const fetchedData = await getJobById(event.jobPostingId);
      // ✨ as any 제거: BackendJob 인터페이스에 정의된 필드 사용
      const mappedJob: ExtendedJobPosting = {
        id: fetchedData.id,
        title: fetchedData.title || event.title,
        companyName: fetchedData.companyName || fetchedData.company_name || event.companyName,
        companyLogo: fetchedData.companyLogo || fetchedData.company_logo || event.companyLogo,
        sourceType: fetchedData.sourceType || 'manual',
        site:
          fetchedData.sourceType === 'auto' ? fetchedData.sourceSiteName || '자동수집' : '수동등록',
        url: fetchedData.sourceUrl || '',
        location: fetchedData.location || '전국',
        experienceLevel: fetchedData.experience || '경력무관',
        deadline: event.date,
        description: fetchedData.description || '상세 설명이 없습니다.',
        commentCount: Number(fetchedData.commentCount || fetchedData.comment_count) || 0,
        viewCount: Number(fetchedData.viewCount || fetchedData.view_count) || 0,
      };
      setSelectedJob(mappedJob);
    } catch (error) {
      console.error('로드 실패', error);
    }
    setIsModalOpen(true);
  };

  const handleMoreClick = (dateStr: string) => {
    setCurrentDate(new Date(dateStr));
    setView('day');
  };

  return (
    <div className="w-full bg-white rounded-4xl shadow-sm p-8 flex flex-col border border-border-light min-h-200">
      <CalendarHeader
        view={view}
        setView={setView}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        filter={filter}
        setFilter={setFilter}
      />

      <div className="flex-1 mt-2">
        <CalendarGrid
          view={view}
          currentDate={currentDate}
          events={filteredEvents}
          onEventClick={handleEventClick}
          onMoreClick={handleMoreClick}
        />
      </div>

      <PostingDetailModal
        isOpen={isModalOpen}
        job={selectedJob}
        onClose={() => setIsModalOpen(false)}
      />

      <StatusDetailSlide
        isOpen={isStatusSlideOpen}
        application={selectedApplication}
        onClose={() => setIsStatusSlideOpen(false)}
      />
    </div>
  );
};

export default Calendar;
