export const PATH = {
  ROOT: '/',
  // CALENDAR: '/calendar', // 일정 확인
  STATUS: '/status', // 지원 현황
  POSTING: '/posting', // 전체 공고
  DASHBOARD: '/dashboard', // 통계 분석
  RESUME: '/resume', // 이력서 관리
  RESUME_CREATE_FORM: '/resume/write', // 공통 이력서 양식으로 작성
  RESUME_VIEW: '/resume/:resumeId',
  SCRAP: '/scrap', // 공고 좋아요
  NOTIFICATION: '/notification', // 알림
  SETTINGS: '/settings', // 계정 설정
  AUTH: '/auth', // 로그인
} as const;
