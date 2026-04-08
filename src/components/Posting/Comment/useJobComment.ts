import { useState, useEffect, useCallback } from 'react';
import { getJobComments, createComment, deleteComment } from '@/api/Comment';
import { useAuthStore } from '@/store/useAuthStore';
import { usePostingStore } from '@/store/usePostingStore'; // 💡 스토어 임포트 추가

export interface FeedComment {
  id: string;
  userId: string;
  userNickname: string;
  userImage: string | null;
  content: string;
  createdAt: string;
}

export interface RawCommentData {
  id?: string | number;
  content?: string;
  createdAt?: string;
  created_at?: string;
  userId?: string | number;
  userNickname?: string;
  profileImageUrl?: string | null;
  author?: {
    id?: string | number;
    name?: string;
    nickname?: string;
    profileImageUrl?: string | null;
    profile_image_url?: string | null;
  };
}

export const mapApiToFeed = (apiItem: RawCommentData): FeedComment => {
  const nickname =
    apiItem.author?.name || apiItem.author?.nickname || apiItem.userNickname || '익명';

  const authorId = apiItem.author?.id || apiItem.userId || '';

  let image =
    apiItem.author?.profileImageUrl ||
    apiItem.author?.profile_image_url ||
    apiItem.profileImageUrl ||
    null;

  if (image === 'null' || image === 'undefined' || image === '') {
    image = null;
  }

  let formattedDate = apiItem.createdAt || apiItem.created_at || new Date().toISOString();
  try {
    formattedDate = new Date(formattedDate).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch (error) {
    console.warn('날짜 변환 실패, 원본을 사용합니다:', error);
  }

  return {
    id: String(apiItem.id || `local-${Date.now()}`),
    userId: String(authorId),
    userNickname: nickname,
    userImage: image,
    content: apiItem.content || '',
    createdAt: formattedDate,
  };
};

export const useJobComment = (jobId: string) => {
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const userInfo = useAuthStore((state) => state.userInfo);

  // 💡 Zustand 스토어의 댓글 카운트 업데이트 함수 가져오기
  const updateCommentCount = usePostingStore((state) => state.updateCommentCount);

  const fetchComments = useCallback(async () => {
    if (!jobId) return;
    setIsLoadingComments(true);
    try {
      const response = (await getJobComments(jobId)) as unknown as { comments?: RawCommentData[] };

      const list: RawCommentData[] = Array.isArray(response.comments)
        ? response.comments
        : Array.isArray(response)
          ? response
          : [];

      const mapped = list.map(mapApiToFeed);
      setComments(mapped);
    } catch (err) {
      console.error('댓글 로드 실패:', err);
    } finally {
      setIsLoadingComments(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    const currentText = commentText;

    try {
      setCommentText('');
      await createComment(jobId, { content: currentText });

      let myImage = userInfo?.profile_image_url || null;
      if (myImage === 'null' || myImage === 'undefined' || myImage === '') myImage = null;

      const newComment: FeedComment = {
        id: `temp-${Date.now()}`,
        userId: String(userInfo?.id || ''),
        userNickname: userInfo?.name || '익명',
        userImage: myImage,
        content: currentText,
        createdAt: new Date().toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }),
      };
      setComments((prev) => [newComment, ...prev]);

      // 💡 서버에 등록 성공 시 전역 스토어 댓글 수 1 증가
      updateCommentCount(jobId, 1);

      await fetchComments();
    } catch (err) {
      console.error('댓글 등록 실패:', err);
    }
  };

  const handleDeleteComment = async (commentId: string | number) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    try {
      await deleteComment(jobId, String(commentId));
      setComments((prev) => prev.filter((c) => String(c.id) !== String(commentId)));

      // 💡 삭제 성공 시 전역 스토어 댓글 수 1 감소
      updateCommentCount(jobId, -1);
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
    }
  };

  const isMine = (item: FeedComment) => {
    return userInfo !== null && String(item.userId) === String(userInfo.id);
  };

  return {
    comments,
    isLoadingComments,
    commentText,
    setCommentText,
    handleAddComment,
    handleDeleteComment,
    isMine,
    userInfo,
  };
};
