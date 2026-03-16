import Sidebar from '@/components/mainLayout/Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="h-dvh flex overflow-hidden">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
