import { Info, Layers } from 'lucide-react';
import { usePostingStore } from '@/store/usePostingStore';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';

interface PostingFilterProps {
  totalCount: number;
}

const PostingFilter = ({ totalCount }: PostingFilterProps) => {
  const { sourceType, setSourceType, sourceSites, selectedSite, setSelectedSite } =
    usePostingStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSourceTypeChange = (type: 'auto' | 'manual') => {
    setSourceType(type);
    const params = new URLSearchParams(searchParams);
    params.set('source', type);
    params.delete('site'); // 출처 변경 시 사이트 필터 초기화
    setSearchParams(params, { replace: true });
  };

  const handleSiteChange = (site: string) => {
    setSelectedSite(site);
    const params = new URLSearchParams(searchParams);
    if (site) {
      params.set('site', site);
    } else {
      params.delete('site');
    }
    setSearchParams(params, { replace: true });
  };

  const filterOptions: { id: 'auto' | 'manual'; label: string }[] = [
    { id: 'auto', label: '자동 공고' },
    { id: 'manual', label: '수동 공고' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* 좌측: 출처 선택 + 사이트 필터 통합 */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 flex-1 overflow-hidden">
          {/* 메인 출처 탭  */}
          <div className="flex p-0.5 bg-gray-100/60 rounded-xl shrink-0 w-fit">
            {filterOptions.map((type) => (
              <button
                key={type.id}
                onClick={() => handleSourceTypeChange(type.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 border border-transparent ${
                  sourceType === type.id
                    ? 'bg-white shadow-sm text-btn-point'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-[1px] bg-gray-300 hidden md:block mx-1" />

          {/* 사이트 선택 */}
          {sourceType === 'auto' ? (
            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide flex-1">
              <button
                onClick={() => handleSiteChange('')}
                className={clsx(
                  'shrink-0 px-4 py-1.5 rounded-full text-xs font-extrabold transition-all duration-200 border',
                  selectedSite === ''
                    ? 'bg-btn-point border-btn-point text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-700 hover:bg-gray-50',
                )}
              >
                전체
              </button>
              <div className="flex gap-1.5 items-center">
                {sourceSites.map((site) => {
                  const isActive = selectedSite === site;
                  return (
                    <button
                      key={site}
                      onClick={() => handleSiteChange(site)}
                      className={clsx(
                        'shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold transition-all duration-200 border',
                        isActive
                          ? 'bg-btn-point border-btn-point text-white shadow-sm'
                          : 'bg-white border-gray-200 text-gray-500 hover:border-gray-700 hover:bg-gray-50',
                      )}
                    >
                      {site}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500 overflow-hidden">
              <Layers size={14} className="shrink-0" />
              <span className="text-xs font-semibold truncate">직접 등록한 공고 리스트입니다.</span>
            </div>
          )}
        </div>

        {/* 우측: 메타데이터 */}
        <div className="flex items-center shrink-0 self-end lg:self-center">
          <div className="flex items-center gap-1.5">
            {sourceType === 'auto' && selectedSite === '' && (
              <div className="group relative">
                <Info
                  size={14}
                  className="text-gray-300 hover:text-btn-point transition-all cursor-help"
                />

                {/* 마우스 오버 시 표시 */}
                <div className="absolute bottom-full right-[-10px] mb-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 z-[100]">
                  <div className="bg-gray-900/95 text-white text-[10px] font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl backdrop-blur-sm border border-white/10">
                    6시간마다 새로운 공고를 자동으로 크롤링합니다.
                    <div className="absolute top-full right-3 border-4 border-transparent border-t-gray-900/95" />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
              <div className="flex items-baseline gap-1">
                <span className="text-[10px] font-bold text-gray-500">총</span>
                <span className="text-sm font-black text-btn-point">
                  {totalCount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostingFilter;
