import { usePostingStore } from '@/store/usePostingStore';

interface PostingFilterProps {
  totalCount: number;
}

const PostingFilter = ({ totalCount }: PostingFilterProps) => {
  const { sourceSites, selectedSite, setSelectedSite, sourceType, setSourceType } =
    usePostingStore();

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 상단 바: 탭 메뉴와 전체 개수 양끝 정렬 */}
      <div className="flex items-end justify-between border-b border-gray-100 pb-4">
        {/* 왼쪽: 수집 모드 탭 */}
        <div className="flex gap-6">
          <button
            onClick={() => setSourceType('auto')}
            className={`pb-2 text-sm font-bold transition-all relative ${
              sourceType === 'auto' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            자동 수집
            {sourceType === 'auto' && (
              <div className="absolute bottom-[-17px] left-0 w-full h-[2px] bg-black" />
            )}
          </button>
          <button
            onClick={() => setSourceType('manual')}
            className={`pb-2 text-sm font-bold transition-all relative ${
              sourceType !== 'auto' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            직접/수동 등록
            {sourceType !== 'auto' && (
              <div className="absolute bottom-[-17px] left-0 w-full h-[2px] bg-black" />
            )}
          </button>
        </div>

        {/* 오른쪽: 전체 개수 표시 */}
        <div className="flex items-center gap-1.5 text-sm font-medium pb-1">
          <span className="text-gray-400">전체</span>
          <span className="text-btn-point font-bold text-xl">{totalCount}</span>
          <span className="text-gray-400">건</span>
        </div>
      </div>

      {/* 하단: 사이트별 칩 필터 (자동 수집 모드일 때만 표시) */}
      {sourceType === 'auto' && sourceSites.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedSite('')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
              selectedSite === ''
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            전체
          </button>
          {sourceSites.map((site) => (
            <button
              key={site}
              onClick={() => setSelectedSite(site)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedSite === site
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {site}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostingFilter;
