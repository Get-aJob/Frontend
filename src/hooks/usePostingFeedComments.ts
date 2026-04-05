import { useCallback, useEffect, useState } from 'react';
import { createComment, deleteComment, getJobComments, updateComment } from '@/api/Comment';
import type { JobCommentApiItem, FeedComment } from '@/types/Comment'; // ✨ 여기서 FeedComment 임포트
import { mapApiToFeed } from '@/components/Posting/Comment/useJobComment';

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
  const [savingCommentId, setSavingCommentId] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

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
        const response = await getJobComments(jobId);
        if (!cancelled) setComments(response.comments.map(mapApiToFeed));
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
        // ✨ 에러 해결: author 객체 타입 명시
        const flat = raw as {
          id?: string;
          content?: string;
          userId?: string;
          userNickname?: string;
          createdAt?: string;
          created_at?: string;
          author?: {
            id?: string;
            name?: string;
            profile_image_url?: string | null;
          };
        };

        const createdAt = flat.createdAt ?? flat.created_at ?? new Date().toISOString();

        setComments((prev) => [
          {
            id: String(flat.id ?? `local-${Date.now()}`),
            userId: String(flat.author?.id ?? flat.userId ?? currentUserDbId ?? ''),
            userNickname: flat.author?.name ?? flat.userNickname ?? currentUserName,
            userImage: flat.author?.profile_image_url ?? currentUserImage,
            content: flat.content ?? trimmed,
            createdAt,
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
  }, [comment, jobId, currentUserName, currentUserImage, currentUserDbId]);

  const startEditComment = useCallback((item: FeedComment) => {
    setSubmitError(null);
    setEditingCommentId(String(item.id));
    setEditingContent(item.content);
  }, []);

  const cancelEditComment = useCallback(() => {
    setEditingCommentId(null);
    setEditingContent('');
  }, []);

  const saveEditComment = useCallback(
    async (item: FeedComment) => {
      if (!jobId) return;
      if (savingCommentId === String(item.id)) return;

      const trimmed = editingContent.trim();
      if (!trimmed || trimmed === item.content) {
        cancelEditComment();
        return;
      }

      setSubmitError(null);
      setSavingCommentId(String(item.id));
      try {
        const updated = await updateComment(jobId, String(item.id), { content: trimmed });
        setComments((prev) =>
          prev.map((c) => (String(c.id) === String(item.id) ? mapApiToFeed(updated) : c)),
        );
        cancelEditComment();
      } catch (error: unknown) {
        setSubmitError(getErrorMessage(error, '댓글 수정에 실패했습니다.'));
      } finally {
        setSavingCommentId(null);
      }
    },
    [jobId, editingContent, cancelEditComment, savingCommentId],
  );

  const deleteCommentItem = useCallback(
    async (item: FeedComment) => {
      if (!jobId) return;
      const commentId = String(item.id);
      if (deletingCommentId === commentId) return;

      const ok = window.confirm('해당 댓글을 삭제하시겠습니까?');
      if (!ok) return;

      setSubmitError(null);
      setDeletingCommentId(commentId);
      try {
        await deleteComment(jobId, commentId);
        setComments((prev) => prev.filter((c) => String(c.id) !== commentId));
      } catch (error: unknown) {
        setSubmitError(getErrorMessage(error, '댓글 삭제에 실패했습니다.'));
      } finally {
        setDeletingCommentId(null);
      }
    },
    [jobId, deletingCommentId],
  );

  const isMine = useCallback(
    (item: FeedComment) =>
      currentUserDbId != null && String(item.userId) === String(currentUserDbId),
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
  };
};
