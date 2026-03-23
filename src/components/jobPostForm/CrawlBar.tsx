import React from 'react';
import { Link } from 'lucide-react';

const CrawlBar = () => {
  return (
    <div className="flex gap-[8px] py-[11px] px-[14px] bg-[#eef2ff] border-[1.5px] border-dashed border-[#c7d2fe] rounded-[10px] mb-[16px] items-center">
      <span className="text-[#4f46e5]">
        <Link size={16} />
      </span>
      <input
        className="flex-1 bg-transparent border-none outline-none text-[12.5px]"
        placeholder="URL을 붙여넣으면 자동으로 채워드려요!"
      />
      <button className="px-[13px] py-[6px] text-[12px] bg-[#4f46e5] text-white rounded-[6px] border border-transparent font-medium cursor-pointer hover:bg-[#4338ca] transition-colors">
        파싱
      </button>
    </div>
  );
};

export default CrawlBar;
