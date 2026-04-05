import { useState } from 'react';
import { RotateCcw, X, Loader2 } from 'lucide-react';
import Button from '@/components/common/UI/Button';
import TextInput from './TextInput';
import TextareaInput from './TextareaInput';
import DeadlineInput from './DeadlineInput';
import LogoUpload from './LogoUpload';
import CrawlBar from './CrawlBar';
import type { JobPosting } from '@/types/Posting';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit' | string;
  initialData?: JobPosting & { logoUrl?: string }; // ✨ any 제거 및 타입 구체화
}

const JobModal = ({ isOpen, onClose, mode = 'create', initialData }: JobModalProps) => {
  // ✨ 수정 포인트 2: useEffect 대신 상태 초기값 설정 시 initialData를 직접 사용합니다.
  // 이 방식은 cascading renders를 방지하고 린트 에러를 해결합니다.
  const [url, setUrl] = useState(initialData?.url || '');
  const [logo, setLogo] = useState<string | null>(initialData?.logoUrl || null);
  const [isAlwaysRecruit, setIsAlwaysRecruit] = useState(initialData?.deadline === '상시채용');

  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReset = () => {
    if (window.confirm('입력한 내용을 모두 초기화하시겠습니까?')) {
      setUrl('');
      setLogo(null);
      setIsAlwaysRecruit(false);
    }
  };

  const handleRegister = async () => {
    setIsSubmitting(true);
    // 등록/수정 로직...
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {mode === 'edit' ? '공고 수정하기' : '새 공고 등록'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <CrawlBar
            url={url}
            onUrlChange={setUrl}
            onParse={async () => setIsParsing(true)}
            isParsing={isParsing}
          />

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-6">
              <TextInput label="회사명" placeholder="회사 이름을 입력하세요" />
              <TextInput label="직무" placeholder="채용 직무를 입력하세요" />
            </div>
            <div className="w-full md:w-48 shrink-0">
              <LogoUpload value={logo} onChange={setLogo} />
            </div>
          </div>

          <DeadlineInput
            isAlwaysRecruit={isAlwaysRecruit}
            onAlwaysRecruitChange={setIsAlwaysRecruit}
          />

          <TextareaInput
            label="공고 상세 내용"
            placeholder="공고 내용을 입력하거나 링크를 붙여넣으세요"
          />
        </div>

        {/* 푸터 */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-500 hover:text-slate-800 hover:bg-gray-200 rounded-xl transition-all"
          >
            <RotateCcw size={16} />
            초기화
          </button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold"
            >
              취소
            </Button>
            <Button
              variant="primary"
              onClick={handleRegister}
              className="px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center min-w-35"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : mode === 'edit' ? (
                '수정 완료'
              ) : (
                '공고 등록하기'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobModal;
