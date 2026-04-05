import Badge from '@/components/common/UI/Badge';
import { Filter, Info, Globe } from 'lucide-react';
import { usePostingStore } from '@/store/usePostingStore';

interface PostingFilterProps {
  totalCount: number;
}

const PostingFilter = ({ totalCount }: PostingFilterProps) => {
  const { sourceType, setSourceType, sourceSites, selectedSite, setSelectedSite } =
    usePostingStore();

  const filterOptions: { id: 'auto' | 'manual' | 'direct'; label: string }[] = [
    { id: 'auto', label: '자동 수집' },
    { id: 'manual', label: '수동 등록' },
    { id: 'direct', label: '직접 작성' },
  ];

  return (
    <div className="flex flex-col gap-6 mb-8">
      <div className="flex justify-between items-center px-1">
        <div className="text-xs font-bold text-gray-400">
          총 <span className="text-btn-point">{totalCount}</span>개의 공고
        </div>
      </div>

      <div className="space-y-4">
        {/* 1. 출처(Source Type) 필터 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <div className="flex items-center gap-1.5 text-gray-400 mr-2 shrink-0">
            <Filter size={14} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-wider">출처</span>
          </div>
          {filterOptions.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                // 💡 불필요한 중복 렌더링/요청 유발 함수 제거
                setSourceType(type.id);
              }}
              className="cursor-pointer shrink-0"
            >
              <Badge variant={sourceType === type.id ? 'point' : 'default'}>{type.label}</Badge>
            </button>
          ))}
        </div>

        {/* 2. 플랫폼(Source Site) 필터 - 자동 수집일 때만 노출 */}
        {sourceType === 'auto' && sourceSites && sourceSites.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide animate-[fadeIn_0.3s_ease]">
            <div className="flex items-center gap-1.5 text-gray-400 mr-2 shrink-0">
              <Globe size={14} strokeWidth={3} />
              <span className="text-[10px] font-black uppercase tracking-wider">사이트</span>
            </div>

            {/* 전체 보기 버튼 */}
            <button
              onClick={() => {
                setSelectedSite(''); // 💡 onPageReset 제거
              }}
              className="cursor-pointer shrink-0"
            >
              <Badge variant={selectedSite === '' ? 'point' : 'default'}>전체</Badge>
            </button>

            {/* 개별 사이트 목록 렌더링 */}
            {sourceSites.map((site) => (
              <button
                key={site}
                onClick={() => {
                  setSelectedSite(site);
                }}
                className="cursor-pointer shrink-0"
              >
                <Badge variant={selectedSite === site ? 'point' : 'default'}>{site}</Badge>
              </button>
            ))}
          </div>
        )}

        {/* 3. 자동 수집 안내 문구 */}
        {sourceType === 'auto' && (
          <div className="flex items-center gap-2 px-4 py-3 bg-purple-50/50 border border-purple-100 rounded-xl">
            <Info size={16} className="text-btn-point shrink-0" />
            <p className="text-[11px] font-bold text-purple-700">
              자동 크롤링 데이터는 6시간마다 업데이트됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostingFilter;
