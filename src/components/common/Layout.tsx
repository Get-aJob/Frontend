import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Topbar from './Topbar/Topbar';
import { PATH } from '@/router/Path';
import { useAuthStore } from '@/store/useAuthStore';


const Layout = () => {
  const location = useLocation();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const getTopbarConfig = () => {
    const baseConfig = { showSearch: true, showAddButton: true };
    switch (location.pathname) {
      case PATH.ROOT:
        return { ...baseConfig, title: '캘린더', badge: 'CALENDAR' };
      case PATH.STATUS:
        return { ...baseConfig, title: '지원 현황', badge: 'STATUS' };
      case PATH.POSTING:
        return { ...baseConfig, title: '전체 공고', badge: 'POSTING' };
      case PATH.DASHBOARD:
        return { ...baseConfig, title: '통계 분석', badge: 'DASHBOARD' };
      case PATH.RESUME:
        return { ...baseConfig, title: '이력서 관리', badge: 'RESUME' };
      case PATH.SCRAP:
        return { ...baseConfig, title: '공고 스크랩', badge: 'SCRAP' };
      case PATH.NOTIFICATION:
        return { ...baseConfig, title: '알림', badge: 'NOTIFICATION' };
      case PATH.SETTINGS:
        return { ...baseConfig, title: '계정 설정', badge: 'SETTINGS' };
      default:
        return { ...baseConfig, title: 'Job-Moa', badge: 'JOB-MOA' };
    }
  };

  const config = getTopbarConfig();
  const publicPaths: string[] = [PATH.ROOT, PATH.POSTING];
  const isPublicPath = publicPaths.includes(location.pathname);

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar
          title={config.title}
          badge={config.badge}
          showSearch={config.showSearch}
          showAddButton={config.showAddButton}
        />

        {/* ✨ 모든 페이지에 공통 적용되는 스크롤 영역과 여백 */}
        <main className="flex-1 overflow-y-auto bg-bg-view scroll-smooth">
          <div className="max-w-[1440px] mx-auto p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {!isLoggedIn && !isPublicPath ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-gray-400 font-medium text-lg text-center">
                  로그인이 필요한 서비스입니다.
                </p>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
