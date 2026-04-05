import React, { useEffect, useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import StatusSummary from '@/components/status/StatusSummary';
import StatusBoard from '@/components/status/StatusBoard';
import StatusDetailSlide from '@/components/status/StatusDetailSlide';
import { useStatusStore } from '@/store/useStatusStore';
import Badge from '@/components/common/UI/Badge';

const Status: React.FC = () => {
  const { fetchData, applications, statuses, selectedApplication, setSelectedApplication } =
    useStatusStore();
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    /* ✨ Layout에서 p-8과 배경색을 담당하므로, 여기선 구조적 간격(gap)만 설정합니다. */
    <div className="flex flex-col gap-8">
      {/* 1. 상단 상태 요약 바 */}
      <StatusSummary />

      {/* 2. 섹션 타이틀 및 뷰 전환 토글 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">진행 단계별 현황</h2>

        <div className="flex bg-white rounded-xl p-1 border border-border-light shadow-sm">
          <button
            onClick={() => setViewMode('board')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              viewMode === 'board'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <LayoutGrid size={16} /> 보드
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <List size={16} /> 리스트
          </button>
        </div>
      </div>

      {/* 3. 메인 컨텐츠 영역 (보드 or 리스트) */}
      <div className="w-full">
        {viewMode === 'board' ? (
          <StatusBoard />
        ) : (
          <div className="bg-white rounded-[32px] border border-border-light shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-sm">
                  <th className="p-5 font-bold">기업명</th>
                  <th className="p-5 font-bold">공고 제목</th>
                  <th className="p-5 font-bold text-center">진행 상태</th>
                  <th className="p-5 font-bold text-center">지원일</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const statusObj = statuses.find((s) => String(s.id) === String(app.statusId));
                  return (
                    <tr
                      key={app.id}
                      className="border-b border-gray-50 last:border-none hover:bg-blue-50/30 transition-colors cursor-pointer group"
                      onClick={() => setSelectedApplication(app)}
                    >
                      <td className="p-5 font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                        {app.jobPostings?.companyName || '회사명 없음'}
                      </td>
                      <td className="p-5 font-bold text-gray-700">
                        {app.jobPostings?.title || '제목 없음'}
                      </td>
                      <td className="p-5 text-center">
                        <Badge variant="point" className="px-3 py-1.5">
                          {statusObj?.displayName || '상태 없음'}
                        </Badge>
                      </td>
                      <td className="p-5 text-center text-gray-500 font-semibold text-sm">
                        {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  );
                })}
                {applications.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-24 text-center text-gray-400 font-bold text-lg">
                      지원 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. 공고 상세 슬라이드 */}
      <StatusDetailSlide
        application={selectedApplication}
        isOpen={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
      />
    </div>
  );
};

export default Status;
