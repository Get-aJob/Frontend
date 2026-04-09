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
  Legend,
} from 'recharts';

interface AnalysisChartsProps {
  statusData: { name: string; value: number }[];
}

const AnalysisCharts = ({ statusData }: AnalysisChartsProps) => {
  // 차트 색상 팔레트
  const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 1. 막대 그래프: 전형 단계별 분포 */}
      <div className="bg-white p-8 rounded-4xl border border-border-light shadow-sm min-h-100 flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-8">전형 단계별 분포</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                dy={10}
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
              <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. 파이 차트: 전체 지원 비율 */}
      <div className="bg-white p-8 rounded-4xl border border-border-light shadow-sm min-h-100 flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-8">전체 지원 비율</h3>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                innerRadius={70}
                outerRadius={100}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => (
                  <span className="text-xs font-bold text-slate-500 ml-1">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCharts;
