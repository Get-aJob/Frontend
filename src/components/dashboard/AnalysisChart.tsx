import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface AnalysisChartsProps {
  statusData: { name: string; value: number }[];
}

const AnalysisCharts = ({ statusData }: AnalysisChartsProps) => {
  // ✨ 사이트 톤에 맞춘 파란색 베이스의 그라데이션 팔레트
  const STATUS_COLORS: Record<string, string> = {
    서류합격: '#7dd3fc', // Sky-300 (가장 연한 파랑)
    코딩테스트: '#38bdf8', // Sky-400
    과제면접: '#0ea5e9', // Sky-500
    '1차면접합격': '#3b82f6', // Blue-500 (메인 블루)
    '2차면접합격': '#2563eb', // Blue-600
    최종합격: '#1e40af', // Blue-800 (가장 깊고 진한 파랑)
    불합격: '#94a3b8', // Slate-400 (차분한 회색빛 파랑 - 튀지 않음)
    미지원: '#cbd5e1', // Slate-300 (가장 연한 회색)
  };

  const FALLBACK_COLORS = ['#93c5fd', '#bfdbfe', '#dbeafe'];

  const validPieData = statusData.filter((item) => item.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 1. 전형 단계별 분포 */}
      <div className="bg-white p-8 rounded-4xl border border-border-light shadow-sm min-h-110 flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-8">전형 단계별 분포</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }}
                interval={0}
                angle={-45}
                textAnchor="end"
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                  padding: '12px',
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={32}>
                {statusData.map((entry, index) => (
                  <Cell
                    key={`bar-cell-${index}`}
                    fill={
                      STATUS_COLORS[entry.name] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. 전체 지원 비율 */}
      <div className="bg-white p-8 rounded-4xl border border-border-light shadow-sm min-h-110 flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-8">전체 지원 비율</h3>
        <div className="flex-1 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={validPieData}
                innerRadius={65}
                outerRadius={95}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                label={({ name, percent }) => {
                  const safePercent = percent ?? 0;
                  return `${name || ''} ${(safePercent * 100).toFixed(0)}%`;
                }}
                labelLine={true}
              >
                {validPieData.map((entry, index) => (
                  <Cell
                    key={`pie-cell-${index}`}
                    fill={
                      STATUS_COLORS[entry.name] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCharts;
