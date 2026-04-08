import { useEffect, useState, useCallback } from 'react';
import type { JobPosting } from '@/types/Posting';
import Badge from '@/components/common/UI/Badge';
import { MessageSquare, Eye } from 'lucide-react';
import { ddayVariant } from '@/utils/statusUtils';
import PostingActionButtons from './PostingActionButtons';
import { getJobComments } from '@/api/Comment';
import type { RawCommentData } from './Comment/useJobComment';
import { usePostingStore } from '@/store/usePostingStore';

interface PostingCardProps {
  posting: JobPosting;
  isScrapped?: boolean;
  onScrap: (id: string | number) => void;
  onDetail: (job: JobPosting) => void;
}

const PostingCard = ({ posting, isScrapped, onScrap, onDetail }: PostingCardProps) => {
  const dday = posting.deadline || '상시채용';

  // 💡 1. 전역 스토어 구독 및 업데이트 함수 가져오기
  const storePostings = usePostingStore((state) => state.postings);
  const updateCommentCount = usePostingStore((state) => state.updateCommentCount);
  const currentStoreJob = storePostings.find((p) => String(p.id) === String(posting.id));

  // 💡 2. API 호출 결과를 저장할 상태
  const [apiCommentCount, setApiCommentCount] = useState<number | null>(null);

  // 💡 3. 표시될 댓글 수 결정
  const displayCommentCount =
    currentStoreJob?.commentCount ?? apiCommentCount ?? posting.commentCount ?? 0;

  const fetchCount = useCallback(async () => {
    try {
      const response = await getJobComments(String(posting.id));
      const list: RawCommentData[] = Array.isArray(response)
        ? response
        : (response as { comments?: RawCommentData[] }).comments || [];

      const count = list.length;
      setApiCommentCount(count);

      // 💡 [중요] 가져온 개수를 전역 스토어에도 반영합니다.
      // 이렇게 하면 새로고침 후에도 스토어가 최신 값을 유지하려 노력합니다.
      if (currentStoreJob && currentStoreJob.commentCount !== count) {
        updateCommentCount(posting.id, count - (currentStoreJob.commentCount || 0));
      }
    } catch (error) {
      console.error('댓글수 조회 실패:', error);
    }
  }, [posting.id, currentStoreJob, updateCommentCount]);

  // 💡 4. [ESLint 해결] useEffect 내 비동기 호출
  useEffect(() => {
    let isMounted = true;

    const getCount = async () => {
      if (isMounted) {
        await fetchCount();
      }
    };

    getCount();

    return () => {
      isMounted = false;
    };
  }, [fetchCount]);

  return (
    <article
      className="group relative bg-white border border-border-light rounded-3xl p-6 transition-all hover:border-btn-point hover:shadow-md cursor-pointer flex flex-col h-full"
      onClick={() => onDetail(posting)}
    >
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-4">
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

      {posting.sourceType !== 'manual' && (
        <div className="flex items-center gap-4 text-gray-300 text-[11px] font-black pt-4 border-t border-gray-50">
          <span className="flex items-center gap-1.5">
            <Eye size={14} strokeWidth={3} /> {posting.viewCount || 0}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquare size={14} strokeWidth={3} /> {displayCommentCount}
          </span>
        </div>
      )}
    </article>
  );
};

export default PostingCard;
