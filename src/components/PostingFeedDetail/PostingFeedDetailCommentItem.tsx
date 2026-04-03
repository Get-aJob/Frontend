import { useEffect, useRef } from 'react';
import type { FeedComment } from './feedComment';

type Props = {
  item: FeedComment;
  isMine: boolean;
  onStartEdit: (item: FeedComment) => void;
  onSaveEdit: (item: FeedComment) => void;
  onCancelEdit: () => void;
  isEditing: boolean;
  isSaving: boolean;
  editingContent: string;
  onEditingContentChange: (value: string) => void;
};

const PostingFeedDetailCommentItem = ({
  item,
  isMine,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  isEditing,
  isSaving,
  editingContent,
  onEditingContentChange,
}: Props) => {
  const isSavingByClickRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!isEditing) return;
    textareaRef.current?.focus();
    textareaRef.current?.setSelectionRange(
      textareaRef.current.value.length,
      textareaRef.current.value.length,
    );
  }, [isEditing]);

  const handleBlur = () => {
    if (isSavingByClickRef.current) {
      isSavingByClickRef.current = false;
      return;
    }
    onCancelEdit();
  };

  return (
    <div
      className={`w-full rounded-xl border px-4 py-3 ${
        isMine ? 'border-[#d9d6fe] bg-[#f3f2ff]' : 'border-[#eef2f7] bg-[#f9fafb]'
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        {item.authorImage ? (
          <img
            src={item.authorImage}
            alt={item.authorName}
            className="h-8 w-8 rounded-full border border-[#e5e7eb] object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4f46e5] text-xs font-bold text-white">
            {(item.authorName || '?').charAt(0)}
          </div>
        )}
        <p className="text-xs font-semibold text-[#111827]">{item.authorId}</p>
        <span className="text-xs text-[#9ca3af]">{item.createdAt}</span>
        {isMine && (
          <div className="ml-auto flex items-center gap-2">
            <span className="rounded-full bg-[#e0e7ff] px-2 py-0.5 text-[10px] font-semibold text-[#4338ca]">
              나
            </span>
            <button
              type="button"
              onMouseDown={() => {
                if (!isEditing || isSaving) return;
                isSavingByClickRef.current = true;
              }}
              onClick={() => (isEditing ? onSaveEdit(item) : onStartEdit(item))}
              disabled={isSaving}
              className="rounded-md border border-[#c7d2fe] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#4f46e5] transition-all hover:-translate-y-[1px] hover:border-[#a5b4fc] hover:bg-[#eef2ff] hover:shadow-sm active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isSaving ? '저장 중…' : isEditing ? '저장' : '수정'}
            </button>
          </div>
        )}
      </div>
      {isEditing ? (
        <div className="mt-2">
          <textarea
            ref={textareaRef}
            value={editingContent}
            onChange={(e) => onEditingContentChange(e.target.value)}
            onBlur={handleBlur}
            disabled={isSaving}
            className="h-[96px] w-full resize-none overflow-y-auto rounded-lg border border-[#d1d5db] bg-white px-3 py-2 text-sm text-[#111827] outline-none ring-[#4f46e5] placeholder:text-[#9ca3af] focus:ring-2"
          />
        </div>
      ) : (
        <textarea
          value={item.content}
          readOnly
          className="h-[96px] w-full resize-none overflow-y-auto border-0 bg-transparent p-0 text-sm text-[#111827] outline-none"
        />
      )}
    </div>
  );
};

export default PostingFeedDetailCommentItem;
