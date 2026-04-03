import { useCallback, useEffect, useState } from 'react';
import { createComment, getJobComments, updateComment } from '@/api/Comment';
import type { JobCommentApiItem } from '@/types/Comment';
import { mapApiToFeed, type FeedComment } from '@/components/PostingFeedDetail/feedComment';

type UsePostingFeedCommentsParams = {
  jobId?: string;
  currentUserName: string;
  currentUserImage: string | null;
  currentUserDbId: string | null;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  const err = error as {
    response?: { data?: { error?: string; message?: string } };
    message?: string;
  };

  return err.response?.data?.error ?? err.response?.data?.message ?? err.message ?? fallback;
};

export const usePostingFeedComments = ({
  jobId,
  currentUserName,
  currentUserImage,
  currentUserDbId,
}: UsePostingFeedCommentsParams) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

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
        const { comments: list } = await getJobComments(jobId);
        if (!cancelled) setComments(list.map(mapApiToFeed));
      } catch (error: unknown) {
        if (cancelled) return;
        setLoadError(getErrorMessage(error, '댓글을 불러오지 못했습니다.'));
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
      const raw = (await createComment(jobId, { content: trimmed })) as unknown;
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
    } catch (error: unknown) {
      setSubmitError(getErrorMessage(error, '댓글 등록에 실패했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  }, [comment, jobId, currentUserName, currentUserImage]);

  const handleEditComment = useCallback(
    async (item: FeedComment) => {
      if (!jobId) return;

      const nextContent = window.prompt('수정할 댓글 내용을 입력하세요.', item.content);
      if (nextContent === null) return;

      const trimmed = nextContent.trim();
      if (!trimmed || trimmed === item.content) return;

      setSubmitError(null);
      setEditingCommentId(item.id);
      try {
        const updated = await updateComment(jobId, item.id, { content: trimmed });
        setComments((prev) => prev.map((c) => (c.id === item.id ? mapApiToFeed(updated) : c)));
      } catch (error: unknown) {
        setSubmitError(getErrorMessage(error, '댓글 수정에 실패했습니다.'));
      } finally {
        setEditingCommentId(null);
      }
    },
    [jobId],
  );

  const isMine = useCallback(
    (item: FeedComment) => currentUserDbId != null && item.authorUserId === currentUserDbId,
    [currentUserDbId],
  );

  return {
    comment,
    setComment,
    comments,
    isLoadingComments,
    loadError,
    isSubmitting,
    submitError,
    editingCommentId,
    handleSubmitComment,
    handleEditComment,
    isMine,
  };
};
