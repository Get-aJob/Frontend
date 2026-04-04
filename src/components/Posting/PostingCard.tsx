import React from 'react';
import { MapPin, Briefcase, Calendar, Bookmark } from 'lucide-react';
import type { ExtendedJobPosting } from '@/store/usePostingStore';
import Badge from '@/components/common/UI/Badge';
import PostingActionButtons from './PostingActionButtons'; // 버튼 컴포넌트 임포트

interface PostingCardProps {
  job: ExtendedJobPosting;
  onToggleScrap: (id: string | number) => void;
  onViewDetail: (job: ExtendedJobPosting) => void;
}

const PostingCard = ({ job, onToggleScrap, onViewDetail }: PostingCardProps) => {
  const handleScrap = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    onToggleScrap(job.id);
  };

  return (
    <div
      onClick={() => onViewDetail(job)} // 카드 전체 클릭 시 상세 보기 모달 오픈
      className="group relative bg-white rounded-4xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <Badge variant="point" className="text-[11px] font-bold px-3 py-1">
          {job.site}
        </Badge>
        <button
          onClick={handleScrap}
          className={`transition-colors ${job.isScrapped ? 'text-btn-point' : 'text-gray-300 hover:text-gray-400'}`}
        >
          <Bookmark size={22} fill={job.isScrapped ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-2xl border border-gray-50 flex items-center justify-center bg-gray-50 shrink-0 overflow-hidden">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.companyName}
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <span className="text-xl font-black text-btn-point">{job.companyName.charAt(0)}</span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-[17px] font-black text-gray-900 truncate mb-0.5">{job.title}</h3>
          <p className="text-[14px] text-gray-500 font-bold truncate">{job.companyName}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-6">
        <div className="flex items-center gap-2 text-gray-400">
          <MapPin size={14} />
          <span className="text-body font-bold truncate">{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Briefcase size={14} />
          <span className="text-body font-bold truncate">{job.experienceLevel}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 col-span-2">
          <Calendar size={14} />
          <span className="text-body font-bold">{job.deadline}</span>
        </div>
      </div>

      {/* 하단 버튼 영역: PostingActionButtons를 사용하여 삭제, 스크랩, 사이트 가기 버튼 통합 노출 */}
      <div className="mt-auto pt-4 border-t border-gray-50">
        <PostingActionButtons job={job} />
      </div>
    </div>
  );
};

export default PostingCard;
