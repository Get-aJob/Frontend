import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { usePostingStore } from '@/store/usePostingStore';
import { useAuthStore } from '@/store/useAuthStore';
import PostingFeedDetailHeader from '@/components/PostingFeedDetail/PostingFeedDetailHeader';
import PostingFeedDetailCommentPanel, {
  type CommentPanelActions,
  type CommentPanelState,
} from '@/components/PostingFeedDetail/PostingFeedDetailCommentPanel';
import { usePostingFeedComments } from '@/hooks/usePostingFeedComments';

const PostingFeedDetail = () => {
  const { jobId } = useParams();
  const postings = usePostingStore((state) => state.postings);
  const userInfo = useAuthStore((state) => state.userInfo);
  const currentUserDbId = userInfo?.id != null ? String(userInfo.id) : null;
  const currentUserName = userInfo?.name ?? '게스트';
  const currentUserImage = userInfo?.profile_image_url ?? null;

  const job = useMemo(
    () => postings.find((item) => String(item.id) === String(jobId)),
    [postings, jobId],
  );

  const {
    comment,
    setComment,
    comments,
    isLoadingComments,
    loadError,
    isSubmitting,
    submitError,
    editingCommentId,
    savingCommentId,
    deletingCommentId,
    editingContent,
    setEditingContent,
    handleSubmitComment,
    startEditComment,
    cancelEditComment,
    saveEditComment,
    deleteCommentItem,
    isMine,
  } = usePostingFeedComments({
    jobId: jobId ? String(jobId) : undefined,
    currentUserName,
    currentUserImage,
    currentUserDbId,
  });

  const commentPanelState: CommentPanelState = {
    comments,
    isLoadingComments,
    loadError,
    submitError,
    comment,
    isSubmitting,
    editingCommentId,
    savingCommentId,
    deletingCommentId,
    editingContent,
  };

  const commentPanelActions: CommentPanelActions = {
    onCommentChange: setComment,
    onSubmitComment: handleSubmitComment,
    isMine,
    onStartEditComment: startEditComment,
    onSaveEditComment: saveEditComment,
    onDeleteComment: deleteCommentItem,
    onCancelEditComment: cancelEditComment,
    onEditingContentChange: setEditingContent,
  };

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f4f5f8] p-6">
      <PostingFeedDetailHeader job={job} />
      <PostingFeedDetailCommentPanel state={commentPanelState} actions={commentPanelActions} />
    </div>
  );
};

export default PostingFeedDetail;
