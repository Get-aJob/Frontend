import { useState, useRef, useEffect } from 'react';
import {
  X,
  ExternalLink,
  MapPin,
  Briefcase,
  Calendar,
  Globe,
  Building2,
  MessageSquare,
  Check,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PATH } from '@/router/Path';
import type { ExtendedJobPosting } from '@/store/usePostingStore';
import Button from '@/components/common/UI/Button';
import JobCommentPanel from './Comment/JobCommentPanel';
import ApplyModal from '@/components/status/ApplyModal';
import { useStatusStore } from '@/store/useStatusStore';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from '@/components/common/UI/Toast';

interface PostingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: ExtendedJobPosting | null;
}

const PostingDetailModal = ({ isOpen, onClose, job }: PostingDetailModalProps) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { applications } = useStatusStore();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  if (!isOpen || !job) return null;

  const isApplied =
    isLoggedIn && applications.some((app) => String(app.jobPostingId) === String(job.id));

  const handleGoToSite = () => {
    if (job.url) {
      window.open(job.url, '_blank', 'noopener,noreferrer');
    } else {
      alert('연결된 공고 주소가 없습니다.');
    }
  };

  const handleApplyClick = () => {
    if (isApplied) {
      onClose();
      navigate(PATH.STATUS);
      return;
    }
    if (!isLoggedIn) {
      setShowToast(true);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => setShowToast(false), 3000);
      return;
    }
    setIsApplyModalOpen(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-1100 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          // ✨ 모바일에서 둥근 모서리 값 축소(rounded-3xl), 높이 소폭 상향
          className="bg-white rounded-3xl sm:rounded-[40px] w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-8 duration-300 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            aria-label="닫기"
            title="닫기"
            // ✨ 모바일에서 닫기 버튼 위치 조정
            className="absolute top-5 right-5 sm:top-8 sm:right-8 z-10 p-1.5 sm:p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>

          {/* 헤더 영역: 패딩 및 로고 크기 축소 */}
          <div className="p-6 sm:p-10 pb-4 sm:pb-8 border-b border-gray-50 shrink-0">
            <div className="flex items-start gap-4 sm:gap-6">
              {/* ✨ 로고 크기 모바일 최적화 */}
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl border border-gray-100 flex items-center justify-center overflow-hidden bg-white shadow-sm shrink-0">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    className="w-full h-full object-contain p-2 sm:p-3"
                    alt="로고"
                  />
                ) : (
                  <div className="text-xl sm:text-3xl font-black text-btn-point">
                    {job.companyName?.charAt(0) || (
                      <Building2 size={24} className="sm:w-8 sm:h-8" />
                    )}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 pt-1 sm:pt-2 pr-6 sm:pr-10">
                {/* ✨ 글씨 크기 모바일 최적화 */}
                <h2 className="text-lg sm:text-2xl font-black text-gray-900 leading-tight mb-1 sm:mb-2 break-words">
                  {job.title}
                </h2>
                <p className="text-sm sm:text-lg text-gray-500 font-bold">{job.companyName}</p>
              </div>
            </div>
          </div>

          {/* 본문 영역: 간격 조절 */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 sm:space-y-12 custom-scrollbar bg-gray-50/30">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { icon: MapPin, label: '근무 지역', value: job.location || '정보 없음' },
                { icon: Briefcase, label: '경력 요구', value: job.experienceLevel || '경력 무관' },
                { icon: Calendar, label: '마감 기한', value: job.deadline },
                {
                  icon: Globe,
                  label: '수집 경로',
                  value: job.sourceType === 'auto' ? '자동 수집' : '사용자 등록',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  // ✨ 정보 카드 패딩 축소
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
                      className="text-[13px] sm:text-[15px] font-black text-gray-800 break-words line-clamp-2 sm:line-clamp-3"
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
                  <MessageSquare size={18} className="text-btn-point sm:w-5 sm:h-5" />
                  댓글
                </h3>
                <JobCommentPanel jobId={String(job.id)} />
              </div>
            )}
          </div>

          {/* 푸터 영역: 버튼 높이 및 폰트 축소 */}
          <div className="p-5 sm:p-8 bg-white border-t border-gray-50 flex gap-3 sm:gap-4 shrink-0">
            <Button
              variant="outline"
              // ✨ 모바일 버튼 높이 h-12(48px), 폰트 크기 조정
              className="flex-1 h-12 sm:h-14 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg border-gray-200 text-gray-500"
              onClick={handleGoToSite}
            >
              원문 <ExternalLink size={18} className="ml-1 sm:ml-2 sm:w-5 sm:h-5" />
            </Button>
            <div className="flex-[2]">
              <Button
                className={`w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg ${
                  isApplied
                    ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-none'
                    : 'shadow-lg shadow-purple-100'
                }`}
                onClick={handleApplyClick}
              >
                {isApplied ? (
                  <span className="flex items-center justify-center gap-1.5 sm:gap-2">
                    <Check size={18} strokeWidth={3} className="sm:w-5 sm:h-5" /> 지원 확인
                  </span>
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
            onSuccess={() => setIsApplyModalOpen(false)}
          />
        )}
      </div>
      <Toast visible={showToast} message="지원하기는 로그인 후 이용할 수 있어요" showLoginButton />
    </>
  );
};

export default PostingDetailModal;
