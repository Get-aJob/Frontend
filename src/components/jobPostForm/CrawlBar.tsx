import { Link } from 'lucide-react';

interface CrawlBarProps {
  url: string;
  onUrlChange: (value: string) => void;
  onParse: () => Promise<void>;
  isParsing: boolean;
}

const CrawlBar = ({ url, onUrlChange, onParse, isParsing }: CrawlBarProps) => {
  return (
    <div className="flex gap-3 py-3 px-4 bg-purple-50/50 border border-dashed border-btn-point/30 rounded-xl mb-8 items-center focus-within:bg-purple-50 transition-all">
      <span className="text-btn-point flex items-center shrink-0">
        <Link size={16} />
      </span>
      <input
        type="url"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        className="flex-1 bg-transparent border-none outline-none text-[13.5px] text-gray-700 placeholder:text-btn-point/40 font-bold"
        placeholder="URL을 붙여넣으면 자동으로 채워드려요!"
      />
      <button
        type="button"
        onClick={onParse}
        disabled={isParsing || !url.trim()}
        className="px-4 py-2 text-[12px] bg-btn-point text-white rounded-lg font-black hover:bg-purple-700 transition-all active:scale-95 disabled:bg-gray-300 shadow-sm"
      >
        {isParsing ? '파싱 중...' : '파싱'}
      </button>
    </div>
  );
};

export default CrawlBar;
