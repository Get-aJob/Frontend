// src/components/scrap/ScrapCard.tsx
import React from 'react';
import type { ScrapItem } from '@/api/Scrap';

interface ScrapCardProps {
  scrap: ScrapItem;
  onUnscrap: (id: string) => void;
}

const GRADIENTS = [
  'linear-gradient(135deg, #ff8f00, #e65100)',
  'linear-gradient(135deg, #5c6bc0, #3949ab)',
  'linear-gradient(135deg, #43a047, #2e7d32)',
  'linear-gradient(135deg, #00acc1, #00838f)',
  'linear-gradient(135deg, #8e24aa, #6a1b9a)',
];

const getGradientForName = (name: string) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return GRADIENTS[hash % GRADIENTS.length];
};

const calculateDday = (deadline: string) => {
  if (!deadline || deadline.includes('상시') || deadline.includes('채용시'))
    return {
      text: '상시',
      bg: 'bg-[#ecfdf5]',
      color: 'text-[#059669]',
      border: 'border-[#a7f3d0]',
    };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(deadline);
  const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0)
    return { text: '마감', bg: 'bg-gray-100', color: 'text-gray-500', border: 'border-gray-200' };
  if (diffDays === 0)
    return { text: 'D-Day', bg: 'bg-rose-50', color: 'text-rose-600', border: 'border-rose-200' };

  if (diffDays <= 3)
    return {
      text: `D-${diffDays}`,
      bg: 'bg-rose-50',
      color: 'text-rose-600',
      border: 'border-rose-200',
    };
  if (diffDays <= 7)
    return {
      text: `D-${diffDays}`,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
      border: 'border-amber-200',
    };

  return {
    text: `D-${diffDays}`,
    bg: 'bg-gray-50',
    color: 'text-gray-600',
    border: 'border-gray-200',
  };
};

const ScrapCard: React.FC<ScrapCardProps> = ({ scrap, onUnscrap }) => {
  const dday = calculateDday(scrap.deadline);

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-indigo-500 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between min-h-42.5 cursor-pointer group">
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-3.5 min-w-0 flex-1">
          <div
            className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center font-bold text-white text-lg shadow-sm"
            style={{
              background: scrap.companyLogo ? 'transparent' : getGradientForName(scrap.companyName),
            }}
          >
            {scrap.companyLogo ? (
              <img
                src={scrap.companyLogo}
                alt="logo"
                className="w-full h-full object-contain rounded-xl border border-gray-100"
              />
            ) : (
              scrap.companyName.charAt(0)
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3 className="font-extrabold text-gray-900 text-[15px] truncate mb-0.5">
              {scrap.companyName}
            </h3>
            <p className="text-[13.5px] text-gray-500 font-medium truncate">{scrap.title}</p>
          </div>
        </div>

        <div className="shrink-0 whitespace-nowrap mt-1">
          <span
            className={`text-[11.5px] font-extrabold px-2.5 py-1 rounded-md border ${dday.bg} ${dday.color} ${dday.border}`}
          >
            {dday.text}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-100">
        <span className="text-[11px] text-gray-400 font-medium tracking-wide">
          📌 {new Date(scrap.createdAt).toLocaleDateString()} 저장
        </span>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUnscrap(scrap.jobPostingId);
            }}
            className="text-xs px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-gray-500 font-bold hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            해제
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              /* TODO: 지원하기 URL 연결 */ alert('지원 페이지로 이동합니다.');
            }}
            className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors"
          >
            지원하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScrapCard;
