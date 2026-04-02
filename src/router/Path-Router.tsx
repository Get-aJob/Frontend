import { createBrowserRouter } from 'react-router-dom';
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
import ResumeForm from '@/view/ResumeForm';
import PostingFeed from '@/view/PostingFeed';
import PostingFeedDetail from '@/view/PostingFeedDetail';

// 라우터 설정
const router = createBrowserRouter([
  {
    path: PATH.ROOT,
    element: <Layout />,
    children: [
      {
        index: true,
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
        path: PATH.POSTING_FEED,
        element: <PostingFeed />,
      },
      {
        path: PATH.POSTING_FEED_DETAIL,
        element: <PostingFeedDetail />,
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
    path: PATH.RESUME_CREATE_FORM,
    element: <ResumeForm />,
  },
  {
    path: PATH.RESUME_VIEW,
    element: <ResumeForm />,
  },
  {
    path: '*',
    element: <div>404 Not Found - 존재하지 않는 페이지입니다.</div>,
  },
]);

export default router;
