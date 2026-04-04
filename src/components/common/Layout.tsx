import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Topbar from './Topbar/Topbar';
import { PATH } from '@/router/Path';
import { useAuthStore } from '@/store/useAuthStore';

const Layout = () => {
  const location = useLocation();

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const getTopbarConfig = () => {
    switch (location.pathname) {
      case PATH.ROOT:
        return { title: '캘린더', badge: 'CALENDAR', showSearch: true, showAddButton: true };
      case PATH.STATUS:
        return { title: '지원 현황', badge: 'STATUS', showSearch: true, showAddButton: true };
      case PATH.POSTING:
        return { title: '전체 공고', badge: 'POSTING', showSearch: true, showAddButton: true };
      case PATH.POSTING_FEED:
        return { title: '공고 댓글', badge: 'POSTING_FEED', showSearch: true, showAddButton: true };
      case PATH.DASHBOARD:
        return { title: '통계 분석', badge: 'DASHBOARD', showSearch: true, showAddButton: true };
      case PATH.RESUME:
        return { title: '이력서 관리', badge: 'RESUME', showSearch: true, showAddButton: true };
      case PATH.SCRAP:
        return { title: '공고 스크랩', badge: 'SCRAP', showSearch: true, showAddButton: true };
      case PATH.NOTIFICATION:
        return { title: '알림', badge: 'NOTIFICATION', showSearch: true, showAddButton: true };
      case PATH.SETTINGS:
        return { title: '계정 설정', badge: 'SETTINGS', showSearch: true, showAddButton: true };
      default:
        return { title: 'Job-Moa', badge: 'JOB-MOA', showSearch: true, showAddButton: true };
    }
  };

  const config = getTopbarConfig();
  const publicPaths: string[] = [PATH.ROOT, PATH.POSTING, PATH.POSTING_FEED];
  const isPublicPath = publicPaths.includes(location.pathname);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar
          title={config.title}
          badge={config.badge}
          showSearch={config.showSearch}
          showAddButton={config.showAddButton}
        />
        <main className="flex-1 overflow-y-auto bg-bg-view">
          {!isLoggedIn && !isPublicPath ? (
            <div className="flex items-center justify-center h-full w-full">
              <p className="text-gray-500 text-subtitle font-medium">로그인 후 이용가능합니다.</p>
            </div>
          ) : (
            <div className="p-6">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
export default Layout;
