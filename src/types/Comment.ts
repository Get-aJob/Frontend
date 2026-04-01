export interface CreateCommentRequest {
  content: string;
}

export interface CommentResponse {
  id: string;
  content: string;
  createdAt?: string;
  created_at?: string;
  author?: {
    id?: string;
    email?: string;
    name?: string;
    profile_image_url?: string | null;
  };
}

export interface JobCommentApiItem {
  id: string;
  jobId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
    profileImageUrl: string | null;
  };
}
export interface JobCommentsListResponse {
  comments: JobCommentApiItem[];
}
