interface StatusItem {
  statusName: string;
}

interface StatusSummaryProps {
  items: StatusItem[];
}

const StatusSummary = ({ items }: StatusSummaryProps) => {
  const summary = items.reduce((acc: Record<string, number>, item) => {
    acc[item.statusName] = (acc[item.statusName] || 0) + 1;
    return acc;
  }, {});

  const statusList = Object.entries(summary);

  return (
    <section className="flex flex-nowrap gap-3 overflow-x-auto pb-2 scrollbar-hide">
      <div className="w-32 shrink-0 rounded-2xl border border-border-light bg-white p-4 shadow-sm">
        <p className="text-2xl font-black text-btn-point">{items.length}</p>
        <p className="mt-1 text-[11px] font-bold text-gray-500 uppercase tracking-wider">전체</p>
      </div>

      {statusList.map(([name, count]) => (
        <div
          key={name}
          className="w-32 shrink-0 rounded-2xl border border-border-light bg-white p-4 shadow-sm"
        >
          <p className="text-2xl font-black text-gray-800">{count}</p>
          <p className="mt-1 truncate text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            {name}
          </p>
        </div>
      ))}
    </section>
  );
};

export default StatusSummary;
