import { useState } from 'react';
import {
  X,
  ExternalLink,
  MapPin,
  Briefcase,
  Calendar,
  Globe,
  Building2,
  MessageSquare,
} from 'lucide-react';
import type { ExtendedJobPosting } from '@/store/usePostingStore';
import Button from '@/components/common/UI/Button';
import JobCommentPanel from './Comment/JobCommentPanel';
import ApplyModal from '@/components/status/ApplyModal';
import { useStatusStore } from '@/store/useStatusStore';
import { useAuthStore } from '@/store/useAuthStore';
import Toast from '@/components/common/UI/Toast';
import { useRef, useEffect } from 'react';

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

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  if (!isOpen || !job) return null;

  const isApplied = applications.some((app) => String(app.jobPostingId) === String(job.id));

  const handleGoToSite = () => {
    if (job.url) {
      window.open(job.url, '_blank', 'noopener,noreferrer');
    } else {
      alert('연결된 공고 주소가 없습니다.');
    }
  };

  const handleApplyClick = () => {
    if (isApplied) return;
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
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-1100 flex items-center justify-center p-4 animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-in slide-in-from-bottom-8 duration-300 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            aria-label="닫기"
            title="닫기"
            className="absolute top-8 right-8 z-10 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="p-10 pb-8 border-b border-gray-50 shrink-0">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-3xl border border-gray-100 flex items-center justify-center overflow-hidden bg-white shadow-sm shrink-0">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    className="w-full h-full object-contain p-3"
                    alt="로고"
                  />
                ) : (
                  <div className="text-3xl font-black text-btn-point">
                    {job.companyName?.charAt(0) || <Building2 size={32} />}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 pt-2">
                <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2 break-words">
                  {job.title}
                </h2>
                <p className="text-lg text-gray-500 font-bold">{job.companyName}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar bg-gray-50/30">
            <div className="grid grid-cols-2 gap-4">
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
                  className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4"
                >
                  <div className="p-2.5 bg-purple-50 rounded-xl text-btn-point shrink-0">
                    <item.icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-gray-400 font-black uppercase mb-0.5 tracking-wider">
                      {item.label}
                    </p>
                    <p
                      className="text-[15px] font-black text-gray-800 break-words line-clamp-3 hover:line-clamp-none transition-all cursor-help"
                      title={String(item.value)}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 ml-1">
                <span className="w-1.5 h-5 bg-btn-point rounded-full" />
                상세 공고 내용
              </h3>
              <div className="bg-white border border-gray-100 p-8 rounded-4xl shadow-sm">
                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-[15px] font-medium min-h-30">
                  {job.description || '상세 설명이 없습니다.'}
                </div>
              </div>
            </div>

            {job.sourceType !== 'manual' && (
              <div className="space-y-6 pt-4">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 ml-1">
                  <MessageSquare size={20} className="text-btn-point" />
                  댓글
                </h3>
                <JobCommentPanel jobId={String(job.id)} />
              </div>
            )}
          </div>

          <div className="p-8 bg-white border-t border-gray-50 flex gap-4 shrink-0">
            <Button
              variant="outline"
              className="flex-1 py-4 rounded-2xl font-black text-lg border-gray-200 text-gray-500 hover:bg-gray-50 transition-all active:scale-[0.98]"
              onClick={handleGoToSite}
            >
              원문 보기 <ExternalLink size={20} className="ml-2" />
            </Button>
            <div className={`flex-[2] ${isApplied ? 'cursor-not-allowed' : ''}`}>
              <Button
                className={`w-full py-4 rounded-2xl font-black text-lg transition-transform ${
                  isApplied
                    ? 'bg-gray-200 text-gray-500 shadow-none opacity-100 hover:scale-100'
                    : 'shadow-lg shadow-purple-100 transition-transform hover:scale-105 active:scale-[0.98]'
                }`}
                onClick={handleApplyClick}
                disabled={isApplied}
              >
                {isApplied ? '지원완료' : '지원하기'}
              </Button>
            </div>
          </div>
        </div>

        {/* 지원 현황 등록 모달 */}
        {isApplyModalOpen && (
          <ApplyModal
            jobPostingId={String(job.id)}
            companyName={job.companyName}
            title={job.title}
            onClose={() => setIsApplyModalOpen(false)}
            onSuccess={() => {
              setIsApplyModalOpen(false);
              // 필요 시 추가적인 성공 처리 (예: 알림)
            }}
          />
        )}
      </div>
      <Toast visible={showToast} message="지원하기는 로그인 후 이용할 수 있어요" showLoginButton />
    </>
  );
};

export default PostingDetailModal;
