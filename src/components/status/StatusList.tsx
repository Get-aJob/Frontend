import Badge from '@/components/common/UI/Badge';
import { ddayVariant } from '@/utils/statusUtils';

interface StatusItem {
  id: string;
  company: string;
  role: string;
  statusName: string;
  dday: string;
  deadline: string;
  appliedAt: string;
}

interface StatusListProps {
  items: StatusItem[];
  onOpenDetail: (id: string) => void;
}

const StatusList = ({ items, onOpenDetail }: StatusListProps) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-border-light bg-white shadow-sm">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50/50 border-b border-border-light">
          <tr className="text-center">
            <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">
              회사
            </th>
            <th className="px-6 py-4 text-left text-[11px] font-black text-gray-400 uppercase tracking-widest">
              직무
            </th>
            <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
              단계
            </th>
            <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
              마감
            </th>
            <th className="px-6 py-4 text-right text-[11px] font-black text-gray-400 uppercase tracking-widest">
              지원일
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {items.map((item) => (
            <tr
              key={item.id}
              onClick={() => onOpenDetail(item.id)}
              className="group cursor-pointer hover:bg-purple-50/30 transition-colors"
            >
              <td className="px-6 py-4 text-left">
                <span className="text-sm font-black text-gray-900 group-hover:text-btn-point transition-colors">
                  {item.company}
                </span>
              </td>
              <td className="px-6 py-4 text-left">
                <span className="text-xs font-medium text-gray-500 truncate block max-w-50">
                  {item.role}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <Badge variant="point">{item.statusName}</Badge>
              </td>
              <td className="px-6 py-4 text-center">
                <span
                  className={`text-xs font-black ${
                    ddayVariant(item.dday) === 'error' ? 'text-status-error' : 'text-gray-700'
                  }`}
                >
                  {item.dday}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="text-xs font-bold text-gray-300">{item.appliedAt}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default StatusList;
