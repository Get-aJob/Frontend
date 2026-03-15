import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Topbar from './Topbar/Topbar';
import { PATH } from '@/router/Path';

const Layout = () => {
  const location = useLocation();
  const getTopbarConfig = () => {
    switch (location.pathname) {
      case PATH.CALENDAR:
        return { title: '캘린더', badge: 'CALENDAR', showSearch: false, showAddButton: true };
      case PATH.STATUS:
        return { title: '지원 현황', badge: 'STATUS', showSearch: true, showAddButton: true };
      case PATH.POSTING:
        return { title: '전체 공고', badge: 'POSTING', showSearch: true, showAddButton: true };
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

  return (
    <div className="flex h-screen bg-[#f8f9fc] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar
          title={config.title}
          badge={config.badge}
          showSearch={config.showSearch}
          showAddButton={config.showAddButton}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
