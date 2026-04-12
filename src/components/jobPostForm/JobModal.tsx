import { useState, useEffect } from 'react';
import { RotateCcw, X, Loader2 } from 'lucide-react';
import Button from '@/components/common/UI/Button';
import TextInput from './TextInput';
import TextareaInput from './TextareaInput';
import DeadlineInput from './DeadlineInput';
import LogoUpload from './LogoUpload';
import CrawlBar from './CrawlBar';
import { usePostingStore, type ExtendedJobPosting } from '@/store/usePostingStore';
import type { DirectJobRequest } from '@/types/Posting';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit';
  initialData?: ExtendedJobPosting;
}

const JobModal = ({ isOpen, onClose, mode = 'create', initialData }: JobModalProps) => {
  const { createJob, updateJob, parseJobUrl } = usePostingStore();

  const [crawlUrl, setCrawlUrl] = useState('');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [logo, setLogo] = useState<string | null>(null);
  const [isAlwaysRecruit, setIsAlwaysRecruit] = useState(false);
  const [externalId, setExternalId] = useState<string | undefined>(undefined);

  const [isParsing, setIsParsing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      if (mode === 'edit' && initialData) {
        setTitle(initialData.title || '');
        setCompanyName(initialData.companyName || '');
        setLocation(initialData.location || '');
        setExperience(initialData.experienceLevel || '');
        setDescription(initialData.description || '');
        setLogo(initialData.companyLogo || null);
        setUrl(initialData.url || '');
        setCrawlUrl('');
        setExternalId(initialData.externalId);

        if (initialData.deadline === '상시채용') {
          setIsAlwaysRecruit(true);
        } else if (initialData.rawDeadline) {
          setDeadline(initialData.rawDeadline);
        } else if (initialData.deadline?.startsWith('20')) {
          setDeadline(initialData.deadline);
        }
      } else {
        handleReset(false);
      }
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, mode, initialData, onClose]);

  const handleReset = (confirm = true) => {
    if (confirm && !window.confirm('입력한 내용을 모두 초기화하시겠습니까?')) return;
    setCrawlUrl('');
    setUrl('');
    setTitle('');
    setCompanyName('');
    setLocation('');
    setExperience('');
    setDescription('');
    setDeadline('');
    setLogo(null);
    setIsAlwaysRecruit(false);
    setExternalId(undefined);
  };

  const handleParse = async () => {
    if (!crawlUrl.trim()) return;
    setIsParsing(true);
    setUrl(crawlUrl);

    try {
      const data = await parseJobUrl(crawlUrl);
      if (data) {
        setTitle((data.title as string) || '');
        setCompanyName((data.companyName as string) || '');
        setLocation((data.location as string) || '');
        setExperience((data.experience as string) || '');
        setLogo((data.companyLogo as string) || null);
        if (mode !== 'edit') {
          setExternalId((data.externalId as string) || undefined);
        }

        const deadlineVal = (data.deadline as string) || '';
        const isAlways = data.deadlineText === '상시채용';

        setIsAlwaysRecruit(isAlways);
        if (isAlways) {
          setDeadline('');
        } else if (deadlineVal) {
          setDeadline(deadlineVal.split('T')[0]);
        }

        const content = data.content as {
          requirements?: string;
          preferred?: string;
          description?: string;
        };
        if (content) {
          const parts = [];
          if (content.requirements) parts.push(`[지원자격]\n${content.requirements}`);
          if (content.preferred) parts.push(`[우대사항]\n${content.preferred}`);
          if (content.description) parts.push(content.description);

          if (parts.length > 0) {
            setDescription(parts.join('\n\n'));
          }
        }
      }
    } catch {
      alert('공고 정보를 가져오는데 실패했습니다.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleRegister = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !companyName.trim()) {
      alert('회사명과 직무는 필수 입력 항목입니다.');
      return;
    }

    if (!isAlwaysRecruit && !deadline) {
      alert('마감일을 선택하거나 상시 모집을 체크해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: DirectJobRequest = {
        title,
        companyName,
        location,
        experience,
        description,
        companyLogo: logo || undefined,
        deadline: isAlwaysRecruit ? null : deadline,
        deadlineText: isAlwaysRecruit ? '상시채용' : '',
        sourceUrl: url || '',
      };

      if (mode === 'edit' && (initialData?.externalId || externalId)) {
        const idToUpdate = (initialData?.externalId || externalId) as string;
        await updateJob(idToUpdate, payload);
      } else {
        await createJob(payload);
      }

      onClose();
    } catch {
      alert('저장에 실패했습니다. 네트워크 상태나 입력 정보를 확인해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-1200 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={(e: React.FormEvent) => handleRegister(e)}
        // ✨ 모바일에서 둥근 정도(rounded-3xl)와 최대 높이 조절
        className="bg-white w-full max-w-2xl rounded-3xl sm:rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-in slide-in-from-bottom-8 duration-300"
      >
        {/* 헤더: 모바일에서 높이 및 패딩 축소 */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800">
            {mode === 'edit' ? '공고 수정하기' : '새 공고 등록'}
          </h2>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => handleReset()}
              className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] sm:text-xs font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <RotateCcw size={13} className="sm:w-3.5 sm:h-3.5" />
              초기화
            </button>
            <div className="w-px h-3.5 bg-gray-100 mx-0.5" />
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={18} className="text-gray-400 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* 본문: 모바일 패딩 축소(p-5) 및 요소 간격 조절 */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 sm:space-y-6 custom-scrollbar">
          {mode !== 'edit' && (
            <CrawlBar
              url={crawlUrl}
              onUrlChange={setCrawlUrl}
              onParse={handleParse}
              isParsing={isParsing}
            />
          )}

          <div className="flex flex-col md:flex-row gap-5 sm:gap-6">
            <div className="flex-1 space-y-5 sm:space-y-6 order-2 md:order-1">
              <TextInput
                label="회사명"
                placeholder="회사 이름을 입력하세요"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <TextInput
                label="직무"
                placeholder="채용 직무를 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextInput
                label="공고 링크 (URL)"
                placeholder="https://example.com/job"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            {/* ✨ 모바일에서 로고 업로드 중앙 정렬 */}
            <div className="w-full md:w-48 shrink-0 flex justify-center md:block order-1 md:order-2">
              <LogoUpload value={logo} onChange={setLogo} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="근무지"
              placeholder="예: 서울 강남구"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <TextInput
              label="경력"
              placeholder="예: 신입, 경력 3년"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>

          <DeadlineInput
            isAlwaysRecruit={isAlwaysRecruit}
            onAlwaysRecruitChange={(checked) => {
              setIsAlwaysRecruit(checked);
              setDeadline('');
            }}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <TextareaInput
            label="공고 상세 내용"
            placeholder="공고 내용을 입력하거나 링크를 붙여넣으세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* 푸터: 모바일 버튼 높이 및 패딩 축소 */}
        <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end shrink-0">
          <div className="flex gap-2.5 sm:gap-3 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bold text-sm sm:text-base"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-[2] sm:flex-none px-6 sm:px-8 py-2 sm:py-2.5 rounded-xl font-bold text-sm sm:text-base min-w-[120px]"
              disabled={isSubmitting || isParsing}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : mode === 'edit' ? (
                '수정 완료'
              ) : (
                '등록하기'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobModal;
