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
import Badge from '@/components/common/UI/Badge';
import JobCommentPanel from './Comment/JobCommentPanel';

interface PostingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: ExtendedJobPosting | null;
}

const PostingDetailModal = ({ isOpen, onClose, job }: PostingDetailModalProps) => {
  if (!isOpen || !job) return null;

  const handleGoToSite = () => {
    if (job.url) {
      window.open(job.url, '_blank', 'noopener,noreferrer');
    } else {
      alert('연결된 공고 주소가 없습니다.');
    }
  };

  return (
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
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="point" className="px-3 py-1 font-bold">
                  {job.site}
                </Badge>
                <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">
                  {job.sourceType || 'manual'}
                </span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight mb-2 truncate">
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
                  <p className="text-[15px] font-black text-gray-800 truncate">{item.value}</p>
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
            className="w-full py-4 rounded-2xl font-black text-lg shadow-lg shadow-purple-100 transition-transform active:scale-[0.98]"
            onClick={handleGoToSite}
          >
            원문 사이트 바로가기 <ExternalLink size={20} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostingDetailModal;
