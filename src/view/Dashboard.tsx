import { useEffect, useMemo } from 'react';
import { useStatusStore } from '@/store/useStatusStore';
import StatCards from '@/components/dashboard/StatCards';
import MonthlyChart from '@/components/dashboard/MonthlyChart';
import AnalysisCharts from '@/components/dashboard/AnalysisChart';
import EmptyState from '@/components/common/UI/EmptyState';
import { BarChart3 } from 'lucide-react';

// ✨ 수정 포인트 1: 월별 데이터 타입 정의
interface MonthlyStat {
  name: string;
  count: number;
  month: number;
  year: number;
}

const Dashboard = () => {
  const { applications, statuses, fetchData } = useStatusStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 전형 단계별 분포 데이터
  const statusData = useMemo(() => {
    return statuses.map((s) => ({
      name: s.displayName,
      value: applications.filter((app) => String(app.statusId) === String(s.id)).length,
    }));
  }, [applications, statuses]);

  // ✨ 수정 포인트 2: last6Months에 명시적인 타입 부여
  const monthlyData = useMemo(() => {
    const last6Months: MonthlyStat[] = []; // 여기에 타입을 지정합니다.

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStr = `${d.getMonth() + 1}월`;
      last6Months.push({
        name: monthStr,
        count: 0,
        month: d.getMonth(),
        year: d.getFullYear(),
      });
    }

    applications.forEach((app) => {
      const appDate = new Date(app.appliedAt || new Date());
      const appMonth = appDate.getMonth();
      const appYear = appDate.getFullYear();

      const target = last6Months.find((m) => m.month === appMonth && m.year === appYear);
      if (target) target.count += 1;
    });

    return last6Months;
  }, [applications]);

  if (applications.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState
          icon={<BarChart3 size={48} className="text-gray-300" />}
          title="분석할 데이터가 없습니다"
          description="지원 현황에 공고를 추가하면 통계 분석이 시작됩니다."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">통계 분석</h2>
        <p className="text-body text-gray-500 font-medium">활동 성과와 지원 추이를 확인하세요.</p>
      </div>

      {/* 분리된 컴포넌트들 호출 */}
      <StatCards applications={applications} statuses={statuses} />
      <MonthlyChart data={monthlyData} />
      <AnalysisCharts statusData={statusData} />
    </div>
  );
};

export default Dashboard;
