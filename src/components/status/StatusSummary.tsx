import React from 'react';
import { useStatusStore } from '@/store/useStatusStore';

const StatusSummary: React.FC = () => {
  const { statuses, applications, isLoading } = useStatusStore();

  if (isLoading && statuses.length === 0) {
    return <div className="h-20 animate-pulse bg-gray-50 rounded-2xl mb-6" />;
  }

  return (
    /* ✨ 세로 나열을 방지하고 가로로 꽉 차게 배치 (grid-cols-5 이상 권장) */
    <div className="w-full mb-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
        {statuses.map((status) => {
          const count = applications.filter(
            (app) => String(app.statusId) === String(status.id),
          ).length;

          return (
            <div
              key={status.id}
              className="bg-white border border-border-light py-3 px-2 rounded-xl flex flex-col items-center justify-center transition-all hover:shadow-sm hover:border-blue-200 group shadow-sm min-w-0"
            >
              {/* 카운트 숫자: 크기를 적절히 조절하여 세로 부피 감소 */}
              <div className="flex items-baseline gap-0.5">
                <span className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                  {count}
                </span>
                <span className="text-[10px] font-bold text-gray-400">건</span>
              </div>

              {/* 상태 이름: 아주 작게 배치하여 띠 형태 유지 */}
              <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter truncate w-full text-center">
                {status.displayName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusSummary;
