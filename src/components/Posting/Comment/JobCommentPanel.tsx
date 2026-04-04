import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useJobComment } from './useJobComment';
import JobCommentItem from './JobCommentItem';
import Button from '@/components/common/UI/Button';
import Skeleton from '@/components/common/UI/Skeleton';

interface JobCommentPanelProps {
  jobId: string;
}

const JobCommentPanel = ({ jobId }: JobCommentPanelProps) => {
  const {
    comments,
    isLoadingComments,
    commentText,
    setCommentText,
    handleAddComment,
    handleDeleteComment,
    isMine,
    userInfo,
  } = useJobComment(jobId);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAddComment();
  };

  // 문자열 "null" 엑스박스 방지
  const profileImg =
    userInfo?.profile_image_url && userInfo.profile_image_url !== 'null'
      ? userInfo.profile_image_url
      : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-body font-black text-btn-point border border-purple-100 shrink-0 overflow-hidden">
          {profileImg ? (
            <img src={profileImg} alt="내 프로필" className="w-full h-full object-cover" />
          ) : (
            userInfo?.name?.charAt(0) || 'U'
          )}
        </div>

        <form onSubmit={onSubmit} className="relative flex-1">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="공고에 대한 의견이나 궁금한 점을 남겨보세요."
            className="w-full bg-gray-50 border border-gray-100 rounded-3xl p-5 pr-20 text-body min-h-27.5 outline-none focus:border-btn-point/20 focus:bg-white transition-all resize-none font-medium placeholder:text-gray-400"
          />
          <div className="absolute bottom-4 right-4">
            <Button
              type="submit"
              size="sm"
              disabled={!commentText.trim()}
              className="rounded-xl px-5 py-2 font-black shadow-sm"
            >
              등록
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {isLoadingComments ? (
          <div className="space-y-3">
            <Skeleton className="h-24 w-full rounded-3xl" />
          </div>
        ) : comments.length > 0 ? (
          comments.map((item) => (
            <JobCommentItem
              key={item.id}
              item={item}
              onDelete={handleDeleteComment}
              canDelete={isMine(item)}
            />
          ))
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-gray-300 gap-3 font-bold">
            <MessageSquare size={40} strokeWidth={1} />
            <p className="text-sm">작성된 댓글이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCommentPanel;
