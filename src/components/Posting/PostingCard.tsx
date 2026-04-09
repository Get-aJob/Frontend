import { useEffect, useState, useCallback } from 'react';
import type { JobPosting } from '@/types/Posting';
import Badge from '@/components/common/UI/Badge';
import { MessageSquare, Eye, Edit2, Trash2, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import JobModal from '@/components/jobPostForm/JobModal';
import { ddayVariant } from '@/utils/statusUtils';
import { getJobComments } from '@/api/Comment';
import type { RawCommentData } from './Comment/useJobComment';
import { usePostingStore } from '@/store/usePostingStore';
import { toggleScrap } from '@/api/Scrap';
import { incrementViewCount } from '@/api/Posting';
import ConfirmModal from '@/components/common/UI/ConfirmModal';

interface PostingCardProps {
  posting: JobPosting;
  isScrapped?: boolean;
  onScrap: (id: string | number) => void;
  onDetail: (job: JobPosting) => void;
}

const PostingCard = ({ posting, isScrapped, onScrap, onDetail }: PostingCardProps) => {
  const dday = posting.deadline || '상시채용';

  // 💡 삭제 로직 및 수정 모달 상태 추가
  const navigate = useNavigate();
  const deleteJob = usePostingStore((state) => state.deleteJob);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 스크랩 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'confirm' | 'success'>('confirm');
  const [modalContent, setModalContent] = useState({
    title: '',
    message: '',
    confirmText: '',
  });

  const handleCardClick = () => {
    if (posting.sourceType !== 'manual') {
      incrementViewCount(posting.id);
    }
    onDetail(posting);
  };

  const handleConfirmScrap = async () => {
    try {
      const result = await toggleScrap(String(posting.id));
      onScrap(posting.id);

      if (result.added) {
        setModalContent({
          title: '스크랩 완료',
          message: '관심있는 공고로 등록되었습니다.',
          confirmText: '내가 저장한 스크랩 확인하기',
        });
        setModalMode('success');
        setIsModalOpen(true);
      } else {
        setIsModalOpen(false);
      }
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 401) {
        setModalContent({
          title: '권한 없음',
          message: '로그인이 필요한 기능입니다.',
          confirmText: '로그인하러 가기',
        });
        setModalMode('success');
        setIsModalOpen(true);
      } else {
        setIsModalOpen(false);
      }
    }
  };

  const handleScrapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isScrapped) {
      setModalMode('confirm');
      setModalContent({
        title: '스크랩 해제',
        message: '이 공고를 스크랩 목록에서 제거하시겠습니까?',
        confirmText: '해제하기',
      });
      setIsModalOpen(true);
    } else {
      handleConfirmScrap();
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!posting.externalId) {
      alert('오류: 공고 식별자가 없습니다.');
      return;
    }
    if (window.confirm('이 공고를 정말 삭제하시겠습니까?')) {
      try {
        await deleteJob(posting.externalId, 'manual');
      } catch {
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  // 💡 1. 전역 스토어 구독 및 업데이트 함수 가져오기
  const storePostings = usePostingStore((state) => state.postings);
  const updateCommentCount = usePostingStore((state) => state.updateCommentCount);
  const currentStoreJob = storePostings.find((p) => String(p.id) === String(posting.id));

  // 💡 2. API 호출 결과를 저장할 상태
  const [apiCommentCount, setApiCommentCount] = useState<number | null>(null);

  // 💡 3. 표시될 댓글 수 결정
  const displayCommentCount =
    currentStoreJob?.commentCount ?? apiCommentCount ?? posting.commentCount ?? 0;

  const fetchCount = useCallback(async () => {
    try {
      const response = await getJobComments(String(posting.id));
      const list: RawCommentData[] = Array.isArray(response)
        ? response
        : (response as { comments?: RawCommentData[] }).comments || [];

      const count = list.length;
      setApiCommentCount(count);

      // 💡 [중요] 가져온 개수를 전역 스토어에도 반영합니다.
      // 이렇게 하면 새로고침 후에도 스토어가 최신 값을 유지하려 노력합니다.
      if (currentStoreJob && currentStoreJob.commentCount !== count) {
        updateCommentCount(posting.id, count - (currentStoreJob.commentCount || 0));
      }
    } catch (error) {
      console.error('댓글수 조회 실패:', error);
    }
  }, [posting.id, currentStoreJob, updateCommentCount]);

  // 💡 4. [ESLint 해결] useEffect 내 비동기 호출
  useEffect(() => {
    // 수동 공고인 경우 댓글/조회수 관련 로직을 수행하지 않음
    if (posting.sourceType === 'manual') return;

    let isMounted = true;

    const getCount = async () => {
      if (isMounted) {
        await fetchCount();
      }
    };

    getCount();

    return () => {
      isMounted = false;
    };
  }, [fetchCount, posting.sourceType]);

  return (
    <>
      <article
        className="group relative bg-white border border-border-light rounded-3xl p-6 transition-all hover:border-btn-point hover:shadow-md cursor-pointer flex flex-col h-full"
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start mb-5">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl bg-gray-50 border border-border-light overflow-hidden flex items-center justify-center shadow-sm cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              {posting.companyLogo ? (
                <img
                  src={posting.companyLogo}
                  alt={posting.companyName}
                  className="w-full h-full object-contain p-1.5"
                />
              ) : (
                <span className="text-xl font-black text-gray-300">
                  {posting.companyName.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-xs font-black text-gray-400 tracking-tight mb-1">
                {posting.companyName}
              </h3>
              <Badge variant={ddayVariant(dday)}>{dday}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-4">
            {/* 공통 스크랩 버튼 */}
            <button
              onClick={handleScrapClick}
              className={`p-1.5 rounded-lg transition-colors flex items-center justify-center bg-white border shadow-sm ${
                isScrapped
                  ? 'text-btn-point border-btn-point bg-blue-50'
                  : 'text-gray-300 border-gray-100 hover:text-btn-point hover:bg-blue-50'
              }`}
              title={isScrapped ? '스크랩 취소' : '스크랩'}
            >
              <Bookmark size={15} fill={isScrapped ? 'currentColor' : 'none'} strokeWidth={2.5} />
            </button>

            {/* 수동 공고 전용 버튼 (수정/삭제) */}
            {posting.sourceType === 'manual' && (
              <>
                <button
                  onClick={handleEdit}
                  className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center bg-white border border-gray-100 shadow-sm"
                  title="수정"
                  aria-label="수정"
                >
                  <Edit2 size={15} strokeWidth={2.5} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center bg-white border border-gray-100 shadow-sm"
                  title="삭제"
                  aria-label="삭제"
                >
                  <Trash2 size={15} strokeWidth={2.5} />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex-1">
          <h4 className="text-subtitle font-black text-gray-900 mb-3 line-clamp-1 group-hover:text-btn-point transition-colors">
            {posting.title}
          </h4>
          <div className="flex flex-wrap gap-1.5">
            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
              #{posting.location || '전국'}
            </span>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
              #{posting.site || '채용공고'}
            </span>
          </div>
        </div>

        {posting.sourceType !== 'manual' && (
          <div className="flex items-center gap-4 text-gray-300 text-[11px] font-black pt-4 border-t border-gray-50">
            <span className="flex items-center gap-1.5">
              <Eye size={14} strokeWidth={3} /> {posting.viewCount || 0}
            </span>
            <span className="flex items-center gap-1.5">
              <MessageSquare size={14} strokeWidth={3} /> {displayCommentCount}
            </span>
          </div>
        )}
      </article>

      {/* 편집 모달 */}
      {isEditModalOpen && (
        <JobModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          mode="edit"
          initialData={posting}
        />
      )}

      {/* 스크랩 확인/성공 모달 */}
      <ConfirmModal
        isOpen={isModalOpen}
        title={modalContent.title}
        message={modalContent.message}
        confirmText={modalContent.confirmText}
        cancelText="닫기"
        isDanger={modalMode === 'confirm' && isScrapped}
        onConfirm={() => {
          if (modalMode === 'confirm') {
            handleConfirmScrap();
          } else {
            if (modalContent.confirmText === '로그인하러 가기') {
              navigate('/auth');
            } else {
              navigate('/scrap');
            }
            setIsModalOpen(false);
          }
        }}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default PostingCard;
