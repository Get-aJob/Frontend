import React, { useState } from 'react';
import type { ScrapItem } from '@/api/Scrap';
import ApplyModal from '@/components/status/ApplyModal';
import ConfirmModal from '@/components/common/UI/ConfirmModal';
import { getJobById } from '@/api/Posting';
import {
  formatLocalDate,
  parseDescription,
  type ExtendedJobPosting,
} from '@/store/usePostingStore';

interface ScrapCardProps {
  scrap: ScrapItem;
  onUnscrap: (id: string) => void;
  onApplySuccess?: () => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setJob: React.Dispatch<React.SetStateAction<ExtendedJobPosting | null>>;
}

const GRADIENTS = [
  'linear-gradient(135deg, #ff8f00, #e65100)',
  'linear-gradient(135deg, #5c6bc0, #3949ab)',
  'linear-gradient(135deg, #43a047, #2e7d32)',
  'linear-gradient(135deg, #00acc1, #00838f)',
  'linear-gradient(135deg, #8e24aa, #6a1b9a)',
];

const getGradientForName = (name: string) => {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return GRADIENTS[hash % GRADIENTS.length];
};

const calculateDday = (deadline: string) => {
  if (!deadline || deadline.includes('상시') || deadline.includes('채용시'))
    return {
      text: '상시',
      bg: 'bg-[#ecfdf5]',
      color: 'text-[#059669]',
      border: 'border-[#a7f3d0]',
      isExpired: false,
    };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(deadline);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0)
    return {
      text: '마감',
      bg: 'bg-gray-100',
      color: 'text-gray-500',
      border: 'border-gray-200',
      isExpired: true,
    };
  if (diffDays === 0)
    return {
      text: 'D-Day',
      bg: 'bg-rose-50',
      color: 'text-rose-600',
      border: 'border-rose-200',
      isExpired: false,
    };
  if (diffDays <= 3)
    return {
      text: `D-${diffDays}`,
      bg: 'bg-rose-50',
      color: 'text-rose-600',
      border: 'border-rose-200',
      isExpired: false,
    };
  if (diffDays <= 7)
    return {
      text: `D-${diffDays}`,
      bg: 'bg-amber-50',
      color: 'text-amber-600',
      border: 'border-amber-200',
      isExpired: false,
    };
  return {
    text: `D-${diffDays}`,
    bg: 'bg-gray-50',
    color: 'text-gray-600',
    border: 'border-gray-200',
    isExpired: false,
  };
};

const ScrapCard: React.FC<ScrapCardProps> = ({
  scrap,
  onUnscrap,
  onApplySuccess,
  setIsOpen,
  setJob,
}) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'confirm' | 'success'>('confirm');
  const [modalMessage, setModalMessage] = useState('');

  const dday = calculateDday(scrap.deadline);

  const handleUnscrapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode('confirm');
    setModalMessage('이 공고를 스크랩 목록에서 삭제하시겠습니까?');
    setIsConfirmModalOpen(true);
  };

  const handleConfirmUnscrap = async () => {
    try {
      await onUnscrap(scrap.jobPostingId);
      setModalMessage('스크랩이 정상적으로 해제되었습니다.');
      setModalMode('success');
    } catch {
      // 💡 78라인: 'error' 변수를 제거하여 no-unused-vars 해결
      setModalMessage('해제 중 오류가 발생했습니다. 다시 시도해주세요.');
      setModalMode('success');
    }
  };

  const handleOnClick = async () => {
    try {
      const jobData = await getJobById(scrap.jobPostingId);
      const deadline = jobData.deadline;
      const deadlineText = jobData.deadline_text || jobData.deadlineText;

      const sourceType = jobData.source_type || jobData.sourceType || 'manual';
      const finalSourceType = sourceType === 'auto' ? 'auto' : 'manual';

      const selectedJob: ExtendedJobPosting = {
        id: jobData.id,
        companyName: jobData.company_name || jobData.companyName || '회사명 미상',
        companyLogo: jobData.company_logo || jobData.companyLogo,
        title: jobData.title || '제목 없음',
        url: jobData.source_url || jobData.sourceUrl,
        site:
          finalSourceType === 'auto'
            ? jobData.source_site_name || jobData.sourceSiteName || '자동 공고'
            : '수동 공고',
        location: jobData.location || '전국',
        experienceLevel: jobData.experience || '경력무관',
        deadline: deadline || deadlineText || '상시채용',
        rawDeadline: deadline ? formatLocalDate(deadline) : undefined,
        isScrapped: false,
        sourceType: finalSourceType,
        externalId: jobData.external_id || jobData.externalId || String(jobData.id),
        description: jobData.description || parseDescription(jobData.content),
        commentCount: jobData.comment_count || jobData.commentCount || 0,
        viewCount: jobData.view_count || jobData.viewCount || 0,
      };
      if (jobData !== null) {
        setJob(selectedJob);
        setIsOpen(true);
      }
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return (
    <>
      {/* 💡 86라인: min-h-[140px]를 권장되는 min-h-35로 변경 */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-btn-point hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between min-h-35 cursor-pointer group">
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleOnClick();
            setIsOpen(true);
          }}
          className="flex justify-between items-start gap-4"
        >
          <div className="flex gap-3.5 min-w-0 flex-1">
            <div
              className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center font-bold text-white text-lg shadow-sm"
              style={{
                background: scrap.companyLogo
                  ? 'transparent'
                  : getGradientForName(scrap.companyName),
              }}
            >
              {scrap.companyLogo ? (
                <img
                  src={scrap.companyLogo}
                  alt="logo"
                  className="w-full h-full object-contain rounded-xl border border-gray-100"
                />
              ) : (
                scrap.companyName.charAt(0)
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h3 className="font-extrabold text-gray-900 text-[15px] truncate mb-0.5">
                {scrap.companyName}
              </h3>
              <p className="text-[13.5px] text-gray-500 font-medium truncate">{scrap.title}</p>
            </div>
          </div>

          <div className="shrink-0 whitespace-nowrap mt-1">
            <span
              className={`text-[11.5px] font-extrabold px-2.5 py-1 rounded-md border ${dday.bg} ${dday.color} ${dday.border}`}
            >
              {dday.text}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <span className="text-body text-gray-400 font-medium tracking-wide">
            📌 {new Date(scrap.createdAt).toLocaleDateString()} 저장
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleUnscrapClick}
              className="text-xs px-3 py-1.5 border border-gray-200 bg-white rounded-lg text-gray-500 font-bold hover:bg-red-50 hover:text-status-error hover:border-red-200 transition-colors"
            >
              해제
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (scrap.isApplied) {
                  setModalMode('success');
                  setModalMessage('이미 지원 완료된 공고입니다.');
                  setIsConfirmModalOpen(true);
                  return;
                }
                setIsApplyModalOpen(true);
              }}
              disabled={scrap.isApplied || dday.isExpired}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all
                          ${
                            dday.isExpired && !scrap.isApplied
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' // 마감됨
                              : scrap.isApplied
                                ? 'bg-blue-50 text-blue-400 cursor-default' // 지원완료 (완료된 느낌)
                                : 'bg-btn-point text-white hover:opacity-90 active:scale-95 shadow-sm' // 일반
                          }`}
            >
              {scrap.isApplied ? '지원완료' : '지원하기'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        title={modalMode === 'confirm' ? '스크랩 해제' : '알림'}
        message={modalMessage}
        confirmText={modalMode === 'confirm' ? '해제하기' : '확인'}
        cancelText="닫기"
        isDanger={modalMode === 'confirm'}
        onConfirm={
          modalMode === 'confirm' ? handleConfirmUnscrap : () => setIsConfirmModalOpen(false)
        }
        onClose={() => setIsConfirmModalOpen(false)}
      />

      {isApplyModalOpen && (
        <ApplyModal
          jobPostingId={scrap.jobPostingId}
          companyName={scrap.companyName}
          title={scrap.title}
          onClose={() => {
            setIsApplyModalOpen(false);
          }}
          onSuccess={() => {
            if (onApplySuccess) onApplySuccess();
          }}
        />
      )}
    </>
  );
};

export default ScrapCard;
