import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ScrapItem } from '@/api/Scrap';
import { PATH } from '@/router/Path';
import ScrapCard from './ScrapCard';

interface ScrapListProps {
  scraps: ScrapItem[];
  onUnscrap: (id: string) => void;
  onApplySuccess: (id: string) => void; // ✨ 추가
}

const ScrapList: React.FC<ScrapListProps> = ({ scraps, onUnscrap, onApplySuccess }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
      {scraps.map((scrap) => (
        <ScrapCard
          key={scrap.jobPostingId}
          scrap={scrap}
          onUnscrap={onUnscrap}
          // ✨ 추가: 카드로 함수 전달
          onApplySuccess={() => onApplySuccess(scrap.jobPostingId)}
        />
      ))}

      <div
        onClick={() => navigate(PATH.POSTING)}
        className="border-2 border-dashed border-gray-200 bg-transparent rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-400 min-h-35 cursor-pointer hover:border-btn-point hover:bg-purple-50/50 hover:text-btn-point transition-all group"
      >
        <div className="text-3xl group-hover:scale-110 transition-transform">🔍</div>
        <div className="text-[14px] font-bold">새로운 공고 탐색하러 가기</div>
      </div>
    </div>
  );
};

export default ScrapList;
