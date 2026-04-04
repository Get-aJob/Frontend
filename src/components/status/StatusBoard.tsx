import Badge from '@/components/common/UI/Badge';
import { ddayVariant } from '@/utils/statusUtils';

interface StatusItem {
  id: string;
  company: string;
  role: string;
  statusName: string;
  dday: string;
  deadline: string;
}

interface StatusBoardProps {
  items: StatusItem[];
  onOpenDetail: (id: string) => void;
}

const StatusBoard = ({ items, onOpenDetail }: StatusBoardProps) => {
  const statusGroups = Array.from(new Set(items.map((item) => item.statusName)));

  return (
    <section className="flex gap-6 overflow-x-auto pb-4 min-h-125">
      {statusGroups.map((status) => (
        <div key={status} className="w-72 shrink-0 flex flex-col">
          {/* 컬럼 헤더 */}
          <div className="mb-4 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-btn-point" />
              <h3 className="font-black text-gray-800 text-sm">{status}</h3>
            </div>
            <span className="text-xs font-bold text-gray-400">
              {items.filter((i) => i.statusName === status).length}
            </span>
          </div>

          {/* 카드 리스트 영역 */}
          <div className="flex flex-col gap-3 rounded-2xl bg-gray-50/50 p-3 border border-dashed border-gray-200 flex-1">
            {items
              .filter((item) => item.statusName === status)
              .map((item) => (
                <article
                  key={item.id}
                  onClick={() => onOpenDetail(item.id)}
                  className="rounded-xl border border-border-light bg-white p-4 shadow-sm transition-all hover:border-btn-point hover:shadow-md cursor-pointer group"
                >
                  <h4 className="font-black text-gray-900 text-sm group-hover:text-btn-point transition-colors">
                    {item.company}
                  </h4>
                  <p className="mt-1 text-xs font-medium text-gray-500 truncate">{item.role}</p>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
                    <Badge variant={ddayVariant(item.dday)}>{item.dday}</Badge>
                    <span className="text-[10px] font-bold text-gray-300">{item.deadline}</span>
                  </div>
                </article>
              ))}

            {items.filter((item) => item.statusName === status).length === 0 && (
              <div className="py-10 text-center text-xs text-gray-400 font-medium">
                일정이 없습니다.
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default StatusBoard;
