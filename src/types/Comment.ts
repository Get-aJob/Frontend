// src/types/Comment.ts

export interface JobCommentApiItem {
  id: string | number;
  content: string;
  userId?: string | number;
  userNickname?: string;
  createdAt?: string;
  created_at?: string;
  jobId?: string;
  author?: {
    id?: string | number;
    name?: string;
    nickname?: string;
    email?: string;
    profile_image_url?: string | null;
  };
  user?: {
    id?: string | number;
    name?: string;
    nickname?: string;
    email?: string;
    profile_image_url?: string | null;
  };
}

export interface JobCommentsListResponse {
  comments: JobCommentApiItem[];
}

export interface CreateCommentRequest {
  content: string;
}

export interface CommentResponse {
  comment: JobCommentApiItem;
}

// ✨ 모든 컴포넌트에서 공통으로 사용할 유일한 FeedComment 타입
export interface FeedComment {
  id: string | number;
  content: string;
  userId: string | number;
  userNickname: string;
  userImage: string | null;
  createdAt: string;
  feedId?: string | number;
}
