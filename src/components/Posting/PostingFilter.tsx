import { usePostingStore } from '@/store/usePostingStore';

interface PostingFilterProps {
  totalCount: number;
  onPageReset: () => void;
}

const PostingFilter = ({ totalCount, onPageReset }: PostingFilterProps) => {
  const { sourceSites, selectedSite, setSelectedSite, sourceType, setSourceType } =
    usePostingStore();

  const handleSiteClick = (site: string) => {
    setSelectedSite(site);
    onPageReset();
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          <button
            onClick={() => setSourceType('auto')}
            className={`pb-2 text-sm font-bold transition-colors ${
              sourceType === 'auto' ? 'border-b-2 border-black text-black' : 'text-gray-400'
            }`}
          >
            자동 수집
          </button>
          <button
            onClick={() => setSourceType('manual')}
            className={`pb-2 text-sm font-bold transition-colors ${
              sourceType !== 'auto' ? 'border-b-2 border-black text-black' : 'text-gray-400'
            }`}
          >
            직접/수동 등록
          </button>
        </div>
        <span className="text-xs text-gray-500">총 {totalCount}개의 공고</span>
      </div>

      {sourceType === 'auto' && sourceSites.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => handleSiteClick('')}
            className={`px-4 py-1.5 rounded-full text-xs transition-colors whitespace-nowrap ${
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
              onClick={() => handleSiteClick(site)}
              className={`px-4 py-1.5 rounded-full text-xs transition-colors whitespace-nowrap ${
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
