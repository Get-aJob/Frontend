import { Link } from 'lucide-react';

// CSS 부분 분리
const STYLES = {
  container:
    'flex gap-[8px] py-[11px] px-[14px] bg-[#eef2ff] border-[1.5px] border-dashed border-[#c7d2fe] rounded-[10px] mb-[16px] items-center',
  iconWrapper: 'text-[#4f46e5] flex items-center',
  input: 'flex-1 bg-transparent border-none outline-none text-[12.5px]',
  button:
    'px-[13px] py-[6px] text-[12px] bg-[#4f46e5] text-white rounded-[6px] border border-transparent font-medium cursor-pointer hover:bg-[#4338ca] transition-colors',
};

const CrawlBar = () => {
  return (
    <div className={STYLES.container}>
      <span className={STYLES.iconWrapper}>
        <Link size={16} />
      </span>
      <input
        className={STYLES.input}
        placeholder="URL을 붙여넣으면 자동으로 채워드려요!"
        aria-label="공고 URL 입력"
        inputMode="url"
      />

      <button
        type="button"
        onClick={() => alert('아직 제공하지 않는 서비스입니다.')}
        className={STYLES.button}
      >
        파싱
      </button>
    </div>
  );
};

export default CrawlBar;
