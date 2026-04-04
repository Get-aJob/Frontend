import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ScrapItem } from '@/api/Scrap';
import { PATH } from '@/router/Path';
import ScrapCard from './ScrapCard';

interface ScrapListProps {
  scraps: ScrapItem[];
  onUnscrap: (id: string) => void;
}

const ScrapList: React.FC<ScrapListProps> = ({ scraps, onUnscrap }) => {
  const navigate = useNavigate();

  return (
    // ✨ 그리드 컨테이너: 양옆 여백을 최소화하기 위해 gap을 적절히 유지하며 카드를 배치합니다.
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
      {/* 1. 스크랩된 공고 목록 렌더링 */}
      {scraps.map((scrap) => (
        <ScrapCard key={scrap.jobPostingId} scrap={scrap} onUnscrap={onUnscrap} />
      ))}

      {/* 2. 탐색 유도 빈 카드 (디자인 시스템 통일) */}
      <div
        onClick={() => navigate(PATH.POSTING)}
        className="border-2 border-dashed border-gray-200 bg-transparent rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-400 min-h-[140px] cursor-pointer hover:border-btn-point hover:bg-purple-50/50 hover:text-btn-point transition-all group"
      >
        <div className="text-3xl group-hover:scale-110 transition-transform">🔍</div>
        <div className="text-[14px] font-bold">새로운 공고 탐색하러 가기</div>
      </div>
    </div>
  );
};

export default ScrapList;
