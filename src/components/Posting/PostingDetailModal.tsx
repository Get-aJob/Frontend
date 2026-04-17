import { useState } from 'react';
import {
  X,
  ExternalLink,
  MapPin,
  Briefcase,
  Calendar,
  Globe,
  Building2,
  Check,
  Bookmark,
  Edit2,
  Trash2,
} from 'lucide-react';
import JobActionsModals from './JobActionsModals';
import { useJobActions } from '@/hooks/useJobActions';
import type { ExtendedJobPosting } from '@/store/usePostingStore';
import Button from '@/components/common/UI/Button';
import JobCommentPanel from './Comment/JobCommentPanel';
import ApplyModal from '@/components/status/ApplyModal';
import { useToastStore } from '@/store/useToastStore';
import { formatFullDate, isExpired } from '@/utils/statusUtils';
import clsx from 'clsx';

interface PostingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: ExtendedJobPosting | null;
}

const PostingDetailModal = ({ isOpen, onClose, job }: PostingDetailModalProps) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const { showToast } = useToastStore();
  const [imgError, setImgError] = useState(false);

  const {
    isScrapped,
    isApplied,
    handleScrapClick,
    handleEdit,
    handleDeleteClick,
    handleConfirmDelete,
    handleGoToSite,
    handleApplyClick,
    handleScrapModalConfirm,
    handleScrapModalClose,
    states,
  } = useJobActions(job);

  if (!isOpen || !job) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-1100 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="bg-white rounded-3xl sm:rounded-[40px] w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 ease-out relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 상단 액션 버튼 그룹 (스크랩, 수정, 삭제, 닫기) */}
          <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-10 flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleScrapClick}
              className={clsx(
                'p-1.5 sm:p-2 rounded-full transition-all duration-200 flex items-center justify-center border shadow-sm',
                isScrapped
                  ? 'text-btn-point border-btn-point bg-blue-50'
                  : 'text-gray-400 border-gray-50 bg-gray-50 hover:text-btn-point hover:bg-purple-50',
              )}
              title={isScrapped ? '스크랩 취소' : '스크랩'}
            >
              <Bookmark
                size={16}
                fill={isScrapped ? 'currentColor' : 'none'}
                className="sm:w-5 sm:h-5"
              />
            </button>

            {job.sourceType === 'manual' && (
              <>
                <button
                  onClick={handleEdit}
                  className="p-1.5 sm:p-2 border border-gray-50 bg-gray-50 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors shadow-sm"
                  title="수정"
                >
                  <Edit2 size={16} className="sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="p-1.5 sm:p-2 border border-gray-50 bg-gray-50 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                  title="삭제"
                >
                  <Trash2 size={16} className="sm:w-5 sm:h-5" />
                </button>
              </>
            )}

            <button
              onClick={onClose}
              aria-label="닫기"
              title="닫기"
              className="p-1.5 sm:p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors shadow-sm"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-10 pb-4 sm:pb-8 border-b border-gray-50 shrink-0">
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl border border-gray-100 flex items-center justify-center overflow-hidden bg-white shadow-sm shrink-0">
                {job.companyLogo && !imgError ? (
                  <img
                    src={job.companyLogo}
                    className="w-full h-full object-contain p-2 sm:p-3"
                    alt="로고"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="p-4 bg-purple-50 rounded-2xl">
                    <Building2 size={32} className="text-btn-point opacity-80" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 pt-0.5 sm:pt-1">
                <h2 className="text-lg sm:text-2xl font-black text-gray-900 leading-tight mb-1 sm:mb-2 break-words pr-24 sm:pr-40">
                  {job.title}
                </h2>
                <p className="text-sm sm:text-lg text-gray-500 font-bold pr-24 sm:pr-40">
                  {job.companyName}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 sm:space-y-12 custom-scrollbar bg-gray-50/30">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                {
                  icon: MapPin,
                  label: '근무 지역',
                  value: job.location || '정보 없음',
                  raw: job.location,
                },
                {
                  icon: Briefcase,
                  label: '경력 요구',
                  value: job.experienceLevel || '경력 무관',
                  raw: job.experienceLevel,
                },
                {
                  icon: Calendar,
                  label: '마감 기한',
                  value: job.deadline ? formatFullDate(job.deadline) : '정보 없음',
                  raw: job.deadline,
                },
                {
                  icon: Globe,
                  label: '수집 경로',
                  value: job.sourceType === 'auto' ? '자동 공고' : '수동 공고',
                  raw: job.sourceType,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm flex items-center gap-3 sm:gap-4"
                >
                  <div className="p-2 sm:p-2.5 bg-purple-50 rounded-xl text-btn-point shrink-0">
                    <item.icon size={16} className="sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] sm:text-[11px] text-gray-400 font-black uppercase mb-0.5 tracking-wider">
                      {item.label}
                    </p>
                    <p
                      className={`text-[13px] sm:text-[15px] font-black break-words line-clamp-2 sm:line-clamp-3 ${
                        item.label === '마감 기한' && isExpired(item.raw)
                          ? 'text-red-500'
                          : 'text-gray-800'
                      }`}
                      title={String(item.value)}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2 ml-1">
                <span className="w-1.5 h-4 sm:h-5 bg-btn-point rounded-full" />
                상세 공고 내용
              </h3>
              <div className="bg-white border border-gray-100 p-5 sm:p-8 rounded-3xl sm:rounded-4xl shadow-sm">
                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-[14px] sm:text-[15px] font-medium min-h-20 sm:min-h-30">
                  {job.description || '상세 설명이 없습니다.'}
                </div>
              </div>
            </div>

            {job.sourceType !== 'manual' && (
              <div className="space-y-4 sm:space-y-6 pt-2">
                <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2 ml-1">
                  <Globe size={18} className="text-btn-point sm:w-5 sm:h-5" />
                  댓글
                </h3>
                <JobCommentPanel jobId={String(job.id)} />
              </div>
            )}
          </div>

          <div className="p-5 sm:p-8 bg-white border-t border-gray-50 flex gap-3 sm:gap-4 shrink-0">
            <Button
              variant="outline"
              className="flex-1 h-12 sm:h-14 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg border-gray-200 text-gray-500"
              onClick={handleGoToSite}
            >
              원문 <ExternalLink size={18} className="ml-1 sm:ml-2 sm:w-5 sm:h-5" />
            </Button>

            <div className="flex-1">
              <Button
                disabled={isExpired(job.deadline) && !isApplied}
                className={`w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg ${
                  isApplied
                    ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-none'
                    : isExpired(job.deadline)
                      ? 'bg-gray-200 text-gray-700 border-gray-300 cursor-not-allowed shadow-none !opacity-100'
                      : 'shadow-lg shadow-purple-100'
                }`}
                onClick={() => handleApplyClick(() => setIsApplyModalOpen(true), onClose)}
              >
                {isApplied ? (
                  <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <Check size={18} strokeWidth={3} className="sm:w-5 sm:h-5" /> 지원 확인
                  </span>
                ) : isExpired(job.deadline) ? (
                  '지원이 마감되었습니다'
                ) : (
                  '지원하기'
                )}
              </Button>
            </div>
          </div>
        </div>

        {isApplyModalOpen && (
          <ApplyModal
            jobPostingId={String(job.id)}
            companyName={job.companyName}
            title={job.title}
            onClose={() => setIsApplyModalOpen(false)}
            onSuccess={() => {
              showToast('지원이 완료되었습니다.');
              setIsApplyModalOpen(false);
            }}
          />
        )}

        <JobActionsModals
          job={job}
          states={states}
          onConfirmDelete={() => handleConfirmDelete(onClose)}
          onScrapConfirm={handleScrapModalConfirm}
          onScrapClose={handleScrapModalClose}
          isNested={true}
        />
      </div>
    </>
  );
};

export default PostingDetailModal;
