import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePostingStore } from '@/store/usePostingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { createComment, getJobComments } from '@/api/Comment';
import type { JobCommentApiItem } from '@/types/Comment';
import PostingFeedDetailHeader from '@/components/PostingFeedDetail/PostingFeedDetailHeader';
import PostingFeedDetailCommentPanel from '@/components/PostingFeedDetail/PostingFeedDetailCommentPanel';
import { mapApiToFeed, type FeedComment } from '@/components/PostingFeedDetail/feedComment';

const PostingFeedDetail = () => {
  const { jobId } = useParams();
  const postings = usePostingStore((state) => state.postings);
  const userInfo = useAuthStore((state) => state.userInfo);

  const [comment, setComment] = useState('');
  const currentUserDbId = userInfo?.id != null ? String(userInfo.id) : null;
  const currentUserName = userInfo?.name ?? '게스트';
  const currentUserImage = userInfo?.profile_image_url ?? null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const job = useMemo(
    () => postings.find((item) => String(item.id) === String(jobId)),
    [postings, jobId],
  );

  useEffect(() => {
    if (!jobId) {
      setIsLoadingComments(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setIsLoadingComments(true);
      setLoadError(null);
      try {
        const { comments: list } = await getJobComments(String(jobId));
        if (cancelled) return;
        setComments(list.map(mapApiToFeed));
      } catch (e: unknown) {
        if (cancelled) return;
        const err = e as {
          response?: { data?: { error?: string; message?: string } };
          message?: string;
        };
        setLoadError(
          err.response?.data?.error ??
            err.response?.data?.message ??
            err.message ??
            '댓글을 불러오지 못했습니다.',
        );
        setComments([]);
      } finally {
        if (!cancelled) setIsLoadingComments(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [jobId]);

  const handleSubmitComment = useCallback(async () => {
    const trimmed = comment.trim();
    if (!trimmed || !jobId) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const raw = (await createComment(String(jobId), { content: trimmed })) as unknown;
      const payload =
        raw &&
        typeof raw === 'object' &&
        'comment' in raw &&
        (raw as { comment?: JobCommentApiItem }).comment != null
          ? (raw as { comment: JobCommentApiItem }).comment
          : null;

      if (payload) {
        setComments((prev) => [mapApiToFeed(payload), ...prev]);
      } else {
        const flat = raw as {
          id?: string;
          content?: string;
          createdAt?: string;
          created_at?: string;
          author?: {
            id?: string;
            email?: string;
            name?: string;
            profile_image_url?: string | null;
          };
        };
        const createdAt =
          flat.createdAt ??
          flat.created_at ??
          new Date().toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
        const authorIdStr = flat.author?.id ?? '';
        setComments((prev) => [
          {
            id: flat.id ?? `local-${Date.now()}`,
            authorUserId: authorIdStr,
            authorId: flat.author?.email ?? flat.author?.name ?? authorIdStr,
            authorName: flat.author?.name ?? currentUserName,
            authorImage: flat.author?.profile_image_url ?? currentUserImage,
            createdAt,
            content: flat.content ?? trimmed,
          },
          ...prev,
        ]);
      }
      setComment('');
    } catch (e: unknown) {
      const err = e as {
        response?: { data?: { error?: string; message?: string } };
        message?: string;
      };
      setSubmitError(
        err.response?.data?.error ??
          err.response?.data?.message ??
          err.message ??
          '댓글 등록에 실패했습니다.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [comment, jobId, currentUserName, currentUserImage]);

  const isMine = useCallback(
    (item: FeedComment) => currentUserDbId != null && item.authorUserId === currentUserDbId,
    [currentUserDbId],
  );

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f4f5f8] p-6">
      <PostingFeedDetailHeader job={job} />
      <PostingFeedDetailCommentPanel
        comments={comments}
        isLoadingComments={isLoadingComments}
        loadError={loadError}
        submitError={submitError}
        comment={comment}
        onCommentChange={setComment}
        isSubmitting={isSubmitting}
        onSubmitComment={handleSubmitComment}
        isMine={isMine}
      />
    </div>
  );
};

export default PostingFeedDetail;
