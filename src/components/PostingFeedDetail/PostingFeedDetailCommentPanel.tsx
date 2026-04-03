import { Send } from 'lucide-react';
import type { FeedComment } from './feedComment';
import PostingFeedDetailCommentItem from './PostingFeedDetailCommentItem';

export type CommentPanelState = {
  comments: FeedComment[];
  isLoadingComments: boolean;
  loadError: string | null;
  submitError: string | null;
  comment: string;
  isSubmitting: boolean;
  editingCommentId: string | null;
  savingCommentId: string | null;
  editingContent: string;
};

export type CommentPanelActions = {
  onCommentChange: (value: string) => void;
  onSubmitComment: () => void;
  isMine: (item: FeedComment) => boolean;
  onStartEditComment: (item: FeedComment) => void;
  onSaveEditComment: (item: FeedComment) => void;
  onCancelEditComment: () => void;
  onEditingContentChange: (value: string) => void;
};

type Props = {
  state: CommentPanelState;
  actions: CommentPanelActions;
};

const PostingFeedDetailCommentPanel = ({ state, actions }: Props) => {
  const {
    comments,
    isLoadingComments,
    loadError,
    submitError,
    comment,
    isSubmitting,
    editingCommentId,
    savingCommentId,
    editingContent,
  } = state;
  const {
    onCommentChange,
    onSubmitComment,
    isMine,
    onStartEditComment,
    onSaveEditComment,
    onCancelEditComment,
    onEditingContentChange,
  } = actions;

  return (
    <section className="rounded-2xl border border-[#e8eaf0] bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-[#111827]">댓글</h2>

      {loadError && (
        <p className="mb-3 text-sm text-red-500" role="alert">
          {loadError}
        </p>
      )}

      {submitError && (
        <p className="mb-3 text-sm text-red-500" role="alert">
          {submitError}
        </p>
      )}

      <div className="mb-5 flex gap-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="댓글을 입력하세요"
          disabled={isSubmitting}
          className="h-11 flex-1 rounded-lg border border-[#d1d5db] px-3 text-sm outline-none ring-[#4f46e5] placeholder:text-[#9ca3af] focus:ring-2 disabled:cursor-not-allowed disabled:bg-[#f3f4f6]"
        />
        <button
          type="button"
          onClick={onSubmitComment}
          disabled={isSubmitting}
          className="flex h-11 items-center gap-1 rounded-lg bg-[#4f46e5] px-4 text-sm font-semibold text-white transition hover:bg-[#4338ca] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={15} />
          {isSubmitting ? '등록 중…' : '등록'}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {isLoadingComments ? (
          <p className="text-sm text-[#6b7280]">댓글을 불러오는 중입니다…</p>
        ) : comments.length > 0 ? (
          comments.map((item) => (
            <PostingFeedDetailCommentItem
              key={item.id}
              item={item}
              isMine={isMine(item)}
              onStartEdit={onStartEditComment}
              onSaveEdit={onSaveEditComment}
              onCancelEdit={onCancelEditComment}
              isEditing={editingCommentId === item.id}
              isSaving={savingCommentId === item.id}
              editingContent={editingContent}
              onEditingContentChange={onEditingContentChange}
            />
          ))
        ) : (
          <p className="text-sm text-[#6b7280]">첫 댓글을 남겨보세요.</p>
        )}
      </div>
    </section>
  );
};

export default PostingFeedDetailCommentPanel;
