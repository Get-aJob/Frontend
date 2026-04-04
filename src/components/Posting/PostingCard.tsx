import React from 'react';
import { MapPin, Briefcase, Calendar } from 'lucide-react';
import type { ExtendedJobPosting } from '@/store/usePostingStore';
import Badge from '@/components/common/UI/Badge';

interface PostingCardProps {
  job: ExtendedJobPosting;
  onDetail: (job: ExtendedJobPosting) => void;
}

// ✨ D-Day 계산 로직 (깔끔한 D-X 형태)
const calculateDday = (deadline: string | undefined) => {
  if (!deadline) return { text: '기한 미상', color: 'bg-gray-50 text-gray-500 border-gray-100' };

  if (deadline.includes('상시')) {
    return { text: '상시채용', color: 'bg-green-50 text-green-600 border-green-200' };
  }

  const deadlineDate = new Date(deadline);

  if (isNaN(deadlineDate.getTime())) {
    return { text: deadline, color: 'bg-gray-50 text-gray-600 border-gray-100' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: '마감', color: 'bg-gray-100 text-gray-400 border-gray-200' };
  }
  if (diffDays === 0) {
    return { text: 'D-Day', color: 'bg-red-50 text-red-500 border-red-200' };
  }
  if (diffDays <= 3) {
    return { text: `D-${diffDays}`, color: 'bg-red-50 text-red-500 border-red-200' }; // 임박
  }

  return { text: `D-${diffDays}`, color: 'bg-purple-50 text-btn-point border-purple-100' };
};

// ✨ 정확한 마감 날짜 포맷 (예: ~ 10.25)
const formatDeadlineDate = (dateString: string | undefined) => {
  if (!dateString || dateString.includes('상시')) return null;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;

  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `~ ${month}.${day}`;
};

const PostingCard = ({ job, onDetail }: PostingCardProps) => {
  const ddayInfo = calculateDday(job.deadline);
  const exactDate = formatDeadlineDate(job.deadline);

  return (
    <div
      onClick={() => onDetail(job)}
      className="bg-white border border-gray-100 rounded-3xl p-6 cursor-pointer hover:border-btn-point/30 hover:shadow-lg transition-all group relative flex flex-col h-full"
    >
      {/* 1. 카드 상단: 사이트 배지 & D-Day 배지 */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="point" className="px-2.5 py-1 text-[11px] font-bold">
            {job.site}
          </Badge>
          <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">
            {job.sourceType === 'auto' ? '자동' : '수동'}
          </span>
        </div>

        {/* ✨ D-X 형태의 깔끔한 배지 */}
        <div
          className={`px-3 py-1 rounded-full border text-[11px] font-black tracking-wide ${ddayInfo.color}`}
        >
          {ddayInfo.text}
        </div>
      </div>

      {/* 2. 카드 본문: 공고 제목 & 회사명 */}
      <div className="flex-1">
        <h3 className="text-[17px] font-black text-gray-900 leading-snug mb-2 group-hover:text-btn-point transition-colors line-clamp-2">
          {job.title}
        </h3>
        <p className="text-[13px] font-bold text-gray-500 mb-5">{job.companyName}</p>
      </div>

      {/* 3. 카드 하단: 지역 & 경력 정보 & 정확한 기한 */}
      <div className="flex items-center gap-4 text-[12px] font-medium text-gray-400 border-t border-gray-50 pt-4 mt-auto">
        <div className="flex items-center gap-1.5">
          <MapPin size={14} />
          <span className="truncate max-w-[80px]">{job.location || '지역무관'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Briefcase size={14} />
          <span className="truncate">{job.experienceLevel || '경력무관'}</span>
        </div>

        {/* ✨ 우측 하단에 정확한 마감 기한 날짜 표시 */}
        {exactDate && (
          <div className="flex items-center gap-1.5 ml-auto text-gray-400 font-bold">
            <Calendar size={13} />
            <span>{exactDate}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostingCard;
