import { useMemo } from 'react';
// ✨ 수정 포인트 1: 올바른 타입 임포트 (ApplicationRecord 사용)
import type { ApplicationRecord, ApplicationStatus } from '@/types/Status';

interface StatCardsProps {
  applications: ApplicationRecord[];
  statuses: ApplicationStatus[];
}

const StatCards = ({ applications, statuses }: StatCardsProps) => {
  const activeCount = useMemo(() => {
    return applications.filter((app) => {
      // ✨ 수정 포인트 2: app.statusId는 ApplicationRecord에 존재함
      const status = statuses.find((s) => String(s.id) === String(app.statusId));
      return status?.displayName !== '불합격' && status?.displayName !== '최종합격';
    }).length;
  }, [applications, statuses]);

  const successCount = useMemo(() => {
    return applications.filter(
      (a) => statuses.find((s) => String(s.id) === String(a.statusId))?.displayName === '최종합격',
    ).length;
  }, [applications, statuses]);

  const successRate =
    applications.length > 0 ? Math.round((successCount / applications.length) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-7 rounded-3xl border border-border-light shadow-sm">
        <p className="text-[11px] font-black text-slate-400 uppercase mb-2">Total Applications</p>
        <h3 className="text-3xl font-black text-slate-900">{applications.length}건</h3>
      </div>
      <div className="bg-white p-7 rounded-3xl border border-border-light shadow-sm">
        <p className="text-[11px] font-black text-slate-400 uppercase mb-2">Active Process</p>
        <h3 className="text-3xl font-black text-blue-600">{activeCount}건</h3>
      </div>
      <div className="bg-white p-7 rounded-3xl border border-border-light shadow-sm">
        <p className="text-[11px] font-black text-slate-400 uppercase mb-2">Success Rate</p>
        <h3 className="text-3xl font-black text-green-500">{successRate}%</h3>
      </div>
    </div>
  );
};

export default StatCards;
