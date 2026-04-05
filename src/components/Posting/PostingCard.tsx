import type { JobPosting } from '@/types/Posting';
import Badge from '@/components/common/UI/Badge';
import { MessageSquare, Eye } from 'lucide-react';
import { ddayVariant } from '@/utils/statusUtils';
import PostingActionButtons from './PostingActionButtons';

interface PostingCardProps {
  posting: JobPosting;
  isScrapped?: boolean;
  onScrap: (id: string | number) => void;
  onDetail: (job: JobPosting) => void;
}

const PostingCard = ({ posting, isScrapped, onScrap, onDetail }: PostingCardProps) => {
  const dday = posting.deadline || '상시채용';

  const handleCardClick = () => {
    onDetail(posting);
  };

  return (
    <article
      onClick={handleCardClick}
      className="group relative bg-white border border-border-light rounded-3xl p-6 transition-all hover:border-btn-point hover:shadow-md cursor-pointer flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-4">
          {/* 💡 로고 영역: 클릭 전파를 차단하여 페이지 이동 방지 */}
          <div
            className="w-14 h-14 rounded-2xl bg-gray-50 border border-border-light overflow-hidden flex items-center justify-center shadow-sm cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {posting.companyLogo ? (
              <img
                src={posting.companyLogo}
                alt={posting.companyName}
                className="w-full h-full object-contain p-1.5"
              />
            ) : (
              <span className="text-xl font-black text-gray-300">
                {posting.companyName.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-xs font-black text-gray-400 tracking-tight mb-1">
              {posting.companyName}
            </h3>
            <Badge variant={ddayVariant(dday)}>{dday}</Badge>
          </div>
        </div>
      </div>

      <div className="flex-1 mb-6">
        <h4 className="text-subtitle font-black text-gray-900 mb-3 line-clamp-1 group-hover:text-btn-point transition-colors">
          {posting.title}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
            #{posting.location || '전국'}
          </span>
          <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
            #{posting.site || '채용공고'}
          </span>
        </div>
      </div>

      <div className="mb-5">
        <PostingActionButtons
          job={{ ...posting, isScrapped }}
          onScrap={onScrap}
          onDetailClick={() => onDetail(posting)}
        />
      </div>

      <div className="flex items-center gap-4 text-gray-300 text-[11px] font-black pt-4 border-t border-gray-50">
        <span className="flex items-center gap-1.5">
          <Eye size={14} strokeWidth={3} /> {posting.viewCount || 0}
        </span>
        <span className="flex items-center gap-1.5">
          <MessageSquare size={14} strokeWidth={3} /> {posting.commentCount || 0}
        </span>
      </div>
    </article>
  );
};

export default PostingCard;
