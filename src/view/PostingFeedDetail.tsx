import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import { usePostingStore } from '@/store/usePostingStore';
import { useAuthStore } from '@/store/useAuthStore';
import { createComment, getJobComments } from '@/api/Comment';
import type { JobCommentApiItem } from '@/types/Comment';

type FeedComment = {
  id: string;
  authorUserId: string;
  authorId: string;
  authorName: string;
  authorImage: string | null;
  createdAt: string;
  content: string;
};

function mapApiToFeed(item: JobCommentApiItem): FeedComment {
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
        const err = e as { response?: { data?: { error?: string; message?: string } }; message?: string };
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

  const handleSubmitComment = async () => {
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
          author?: { id?: string; email?: string; name?: string; profile_image_url?: string | null };
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
      const err = e as { response?: { data?: { error?: string; message?: string } }; message?: string };
      setSubmitError(
        err.response?.data?.error ??
        err.response?.data?.message ??
        err.message ??
        '댓글 등록에 실패했습니다.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMine = (item: FeedComment) =>
    currentUserDbId != null && item.authorUserId === currentUserDbId;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f4f5f8] p-6">
      <section className="mb-5 rounded-2xl border border-[#e8eaf0] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          {job?.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.companyName}
              className="h-14 w-14 rounded-xl border border-[#f3f4f6] bg-white object-contain"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#4ade80] text-xl font-extrabold text-white">
              {job?.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-[#111827]">{job?.companyName ?? '회사 정보'}</p>
            <p className="mt-1 text-sm text-[#6b7280]">
              {job?.title ?? '채용 공고 제목'} · {job?.location ?? '근무지 정보 없음'}
            </p>
          </div>
        </div>
      </section>

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
            onChange={(e) => setComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            disabled={isSubmitting}
            className="h-11 flex-1 rounded-lg border border-[#d1d5db] px-3 text-sm outline-none ring-[#4f46e5] placeholder:text-[#9ca3af] focus:ring-2 disabled:cursor-not-allowed disabled:bg-[#f3f4f6]"
          />
          <button
            type="button"
            onClick={handleSubmitComment}
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
              <div
                key={item.id}
                className={`w-full rounded-xl border px-4 py-3 ${isMine(item) ? 'border-[#d9d6fe] bg-[#f3f2ff]' : 'border-[#eef2f7] bg-[#f9fafb]'
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
                  {isMine(item) && (
                    <span className="ml-auto rounded-full bg-[#e0e7ff] px-2 py-0.5 text-[10px] font-semibold text-[#4338ca]">
                      나
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#111827]">{item.content}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#6b7280]">첫 댓글을 남겨보세요.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default PostingFeedDetail;
