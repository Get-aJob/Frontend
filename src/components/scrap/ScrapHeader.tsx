import React from 'react';
import type { ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from '@/router/Path';

interface ScrapHeaderProps {
  count: number;
  sortBy: 'latest' | 'deadline';
  onSortChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const ScrapHeader: React.FC<ScrapHeaderProps> = ({ count, sortBy, onSortChange }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex gap-4 items-center">
        <h2 className="text-title text-gray-800 font-bold tracking-tight">
          저장된 공고 <span className="text-btn-point">{count}</span>개
        </h2>
        <select
          value={sortBy}
          onChange={onSortChange}
          className="py-1.5 px-2.5 border border-gray-200 rounded-lg text-subtitle font-medium text-gray-600 outline-none focus:border-btn-point focus:ring-1 focus:ring-btn-point transition-all bg-white cursor-pointer"
        >
          <option value="latest">최신 스크랩순</option>
          <option value="deadline">마감 임박순</option>
        </select>
      </div>
      <button
        onClick={() => navigate(PATH.POSTING)}
        className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-lg text-subtitle font-bold text-gray-700 hover:bg-gray-50 hover:text-btn-point transition-colors shadow-sm"
      >
        🔍 새로운 공고 탐색
      </button>
    </div>
  );
};

export default ScrapHeader;
