import type { FeedComment } from './feedComment';

type Props = {
  item: FeedComment;
  isMine: boolean;
};

const PostingFeedDetailCommentItem = ({ item, isMine }: Props) => {
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
          <span className="ml-auto rounded-full bg-[#e0e7ff] px-2 py-0.5 text-[10px] font-semibold text-[#4338ca]">
            나
          </span>
        )}
      </div>
      <p className="text-sm text-[#111827]">{item.content}</p>
    </div>
  );
};

export default PostingFeedDetailCommentItem;
