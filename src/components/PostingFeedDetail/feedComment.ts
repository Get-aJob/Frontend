import type { JobCommentApiItem } from '@/types/Comment';

export type FeedComment = {
  id: string;
  authorUserId: string;
  authorId: string;
  authorName: string;
  authorImage: string | null;
  createdAt: string;
  content: string;
};

export function mapApiToFeed(item: JobCommentApiItem): FeedComment {
  return {
    id: item.id,
    authorUserId: item.author.id,
    authorId: item.author.name ?? item.author.id,
    authorName: item.author.name ?? '익명',
    authorImage: item.author.profileImageUrl,
    createdAt: new Date(item.createdAt).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
    content: item.content,
  };
}
