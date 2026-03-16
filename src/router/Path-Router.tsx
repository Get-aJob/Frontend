import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PATH } from './Path';

import Layout from '@/components/common/Layout';

import Calendar from '@/view/Calendar';
import Status from '@/view/Status';
import Posting from '@/view/Posting';
import Dashboard from '@/view/Dashboard';
import Resume from '@/view/Resume';
import Scrap from '@/view/Scrap';
import Notification from '@/view/Notification';
import Settings from '@/view/Settings';
import Auth from '@/view/Auth';

// 라우터 설정
const router = createBrowserRouter([
  {
    path: PATH.ROOT,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to={PATH.CALENDAR} replace />,
      },
      {
        path: PATH.CALENDAR,
        element: <Calendar />,
      },
      {
        path: PATH.STATUS,
        element: <Status />,
      },
      {
        path: PATH.POSTING,
        element: <Posting />,
      },
      {
        path: PATH.DASHBOARD,
        element: <Dashboard />,
      },
      {
        path: PATH.RESUME,
        element: <Resume />,
      },
      {
        path: PATH.SCRAP,
        element: <Scrap />,
      },
      {
        path: PATH.NOTIFICATION,
        element: <Notification />,
      },
      {
        path: PATH.SETTINGS,
        element: <Settings />,
      },
    ],
  },
  {
    path: PATH.AUTH,
    element: <Auth />,
  },
  {
    path: '*',
    element: <div>404 Not Found - 존재하지 않는 페이지입니다.</div>,
  },
]);

export default router;
