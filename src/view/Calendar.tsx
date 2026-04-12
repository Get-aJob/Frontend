import { useEffect, useState, useMemo } from 'react';
import { getSchedules } from '@/api/Schedules';
import { getJobById } from '@/api/Posting';
import { getUserApplications } from '@/api/Status';
import type { ScheduleEvent, ViewType, EventFilterType } from '@/types/Calendar';
import type { ApplicationRecord } from '@/types/Status';
import CalendarHeader from '@/components/calendar/CalendarHeader';
import CalendarGrid from '@/components/calendar/CalendarGrid';
import PostingDetailModal from '@/components/Posting/PostingDetailModal';
import StatusDetailSlide from '@/components/status/StatusDetailSlide';
import { usePostingStore, type ExtendedJobPosting } from '@/store/usePostingStore';
import { useStatusStore } from '@/store/useStatusStore';
import { useAuthStore } from '@/store/useAuthStore'; // ✨ AuthStore 추가

const parseDescription = (content: string | Record<string, unknown> | undefined): string => {
  if (!content) return '';
  if (typeof content === 'object') return (content.description as string) || '';
  try {
    const parsed = JSON.parse(content);
    return typeof parsed === 'object' && parsed !== null ? parsed.description || '' : content;
  } catch {
    return content;
  }
};

const Calendar = () => {
  const [view, setView] = useState<ViewType>('month');
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filter, setFilter] = useState<EventFilterType>('all');

  const [selectedJob, setSelectedJob] = useState<ExtendedJobPosting | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationRecord | null>(null);
  const [isStatusSlideOpen, setIsStatusSlideOpen] = useState(false);

  const postings = usePostingStore((state) => state.postings);
  const { fetchData: fetchStatusData } = useStatusStore();
  const { isLoggedIn } = useAuthStore(); // ✨ 로그인 상태 가져오기

  // 로그인 상태일 때만 지원 현황 데이터 패칭
  useEffect(() => {
    if (isLoggedIn) {
      fetchStatusData();
    }
  }, [fetchStatusData, isLoggedIn]);

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
        // ✨ 비로그인 시 지원현황(getUserApplications)은 호출하지 않음 방어 로직 추가
        const [scheduleRes, applicationsRes] = await Promise.all([
          getSchedules({ startDate, endDate }),
          isLoggedIn ? getUserApplications() : Promise.resolve([]),
        ]);

        let combinedEvents: ScheduleEvent[] = [];

        if (scheduleRes?.schedules?.events) {
          const deadlineEvents = scheduleRes.schedules.events.filter(
            (e) => e.eventType === 'deadline',
          );
          combinedEvents = [...deadlineEvents];
        }

        if (applicationsRes && applicationsRes.length > 0) {
          setApplications(applicationsRes);

          const appliedEvents: ScheduleEvent[] = applicationsRes.map((app) => {
            const dateStr = app.appliedAt
              ? app.appliedAt.split('T')[0]
              : app.createdAt.split('T')[0];

            return {
              jobPostingId: String(app.jobPostingId),
              type: 'job_post',
              eventType: 'applied',
              title: app.jobPostings?.title || '제목 없음',
              companyName: app.jobPostings?.companyName || '회사명 없음',
              date: dateStr,
              isApplied: true,
              statusName: app.statusName || app.applicationStatuses?.displayName || '지원 현황',
            };
          });
          combinedEvents = [...combinedEvents, ...appliedEvents];
        }

        if (isMounted) {
          setEvents(combinedEvents);
        }
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      }
    };
    fetchSchedules();
    return () => {
      isMounted = false;
    };
  }, [currentDate, view, isLoggedIn]);

  const filteredEvents = useMemo(() => {
    const toLocalDateStr = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    };
    const todayStr = toLocalDateStr(new Date());

    const validEvents = events.filter((e) => {
      if (e.eventType === 'deadline' && e.date < todayStr) return false;
      // ✨ 비로그인 상태일 때 수동 공고(manual) 숨김 처리
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
  }, [events, filter, isLoggedIn]);

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

      let finalDeadline = '상시채용';
      const deadline = fetchedData.deadline;
      const deadlineText = fetchedData.deadlineText || fetchedData.deadline_text;

      if (deadline) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(deadline);
        targetDate.setHours(0, 0, 0, 0);
        const diffTime = targetDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) finalDeadline = 'D-Day';
        else if (diffDays > 0) finalDeadline = `D-${diffDays}`;
        else finalDeadline = `마감 (D+${Math.abs(diffDays)})`;
      } else if (deadlineText) {
        finalDeadline = deadlineText.includes('상시') ? '상시채용' : deadlineText;
      }

      const sourceType =
        fetchedData.sourceType || fetchedData.source_type || event.sourceType || 'manual';
      const finalSourceType = sourceType === 'auto' ? 'auto' : sourceType;
      const siteName = fetchedData.sourceSiteName || fetchedData.source_site_name || '자동수집';

      const safeData = fetchedData as unknown as Record<string, unknown>;

      const mappedJob: ExtendedJobPosting = {
        id: fetchedData.id,
        title: fetchedData.title || event.title,
        companyName: fetchedData.companyName || fetchedData.company_name || event.companyName,
        companyLogo: fetchedData.companyLogo || fetchedData.company_logo || event.companyLogo,
        sourceType: finalSourceType,
        site: finalSourceType === 'auto' ? siteName : '수동등록',
        url: fetchedData.sourceUrl || fetchedData.source_url || '',
        location: fetchedData.location || '전국',
        experienceLevel: fetchedData.experience || '경력무관',
        deadline: finalDeadline,
        description:
          fetchedData.description ||
          parseDescription(fetchedData.content) ||
          '상세 설명이 없습니다.',
        commentCount: Number(safeData.commentCount || safeData.comment_count) || 0,
        viewCount: Number(safeData.viewCount || safeData.view_count) || 0,
      };

      setSelectedJob(mappedJob);
    } catch (error) {
      console.error('공고 상세 정보를 불러오지 못했습니다.', error);
      setSelectedJob({
        id: event.jobPostingId,
        title: event.title,
        companyName: event.companyName,
        companyLogo: event.companyLogo || '',
        sourceType: event.sourceType || 'manual',
        site: event.sourceType === 'auto' ? '자동수집' : '수동등록',
        url: '',
        location: '상세정보 필요',
        experienceLevel: '상세정보 필요',
        deadline: event.date,
        description: '공고 정보를 불러올 수 없습니다.',
        commentCount: 0,
        viewCount: 0,
      });
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
