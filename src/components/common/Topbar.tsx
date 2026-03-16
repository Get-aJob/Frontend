interface TopbarProps {
  title: string;
  badgeText?: string;
  showSearch?: boolean;
  actions?: React.ReactNode;
}

const Topbar = ({ title, badgeText, showSearch = false, actions }: TopbarProps) => {
  return (
    <header className="h-15.5 bg-white border-b border-[#e8eaf0] flex items-center px-6 gap-3 w-full box-border z-100">
      <div className="flex items-center gap-2">
        <h1 className="text-[17px] font-extrabold text-[#111827] flex items-center gap-2 min-w-20">
          {title}
        </h1>
        {badgeText && (
          <span className="text-[10px] font-bold px-2.25 py-0.75 rounded-[5px] bg-[#eef2ff] text-[#4f46e5]">
            {badgeText}
          </span>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2.5">
        {showSearch && (
          <div className="bg-[#f8f9fc] border-[1.5px] border-[#e8eaf0] rounded-[10px] px-3.5 py-2 flex items-center gap-1.75 w-55 focus-within:border-[#4f46e5] transition-colors">
            <span className="text-sm">🔍</span>
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              className="bg-transparent border-none outline-none text-[13px] w-full text-gray-700"
            />
          </div>
        )}
        <div id="topbar-actions">{actions}</div>
      </div>
    </header>
  );
};

export default Topbar;
