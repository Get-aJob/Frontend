import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { ScrapItem } from '@/api/Scrap';
import { PATH } from '@/router/Path';
import ScrapCard from './ScrapCard'; // 이전에 만든 카드 컴포넌트

interface ScrapListProps {
  scraps: ScrapItem[];
  onUnscrap: (id: string) => void;
}

const ScrapList: React.FC<ScrapListProps> = ({ scraps, onUnscrap }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
      {scraps.map((scrap) => (
        <ScrapCard key={scrap.jobPostingId} scrap={scrap} onUnscrap={onUnscrap} />
      ))}

      {/* 탐색 유도 빈 카드 */}
      <div
        onClick={() => navigate(PATH.POSTING)}
        className="border-2 border-dashed border-gray-200 bg-transparent rounded-2xl flex flex-col items-center justify-center gap-3 text-gray-400 min-h-42.5 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-500 transition-all"
      >
        <div className="text-3xl">🔍</div>
        <div className="text-[14px] font-bold">새로운 공고 탐색하러 가기</div>
      </div>
    </div>
  );
};

export default ScrapList;
