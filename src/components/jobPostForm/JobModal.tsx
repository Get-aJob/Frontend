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

  const [crawlUrl, setCrawlUrl] = useState(''); // 상단 파싱 바 전용 상태
  const [url, setUrl] = useState(''); // 실제 저장될 공고 링크 상태
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

  // ESC 키로 닫기 및 초기 데이터 설정
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

    // 💡 파싱하기 버튼 클릭 시 하단 공고 링크 칸도 같이 채워줌
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

        // 1. 날짜 포맷 변환 (ISO -> YYYY-MM-DD)
        if (data.deadline) {
          const dateStr = data.deadline as string;
          setDeadline(dateStr.split('T')[0]);
        }

        if (data.deadlineText === '상시채용') setIsAlwaysRecruit(true);

        // 2. 상세 내용 추출 (지원자격/우대사항 등)
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
      // 새 공고 등록 시 파싱된 externalId를 그대로 보내면
      // 크롤러가 수집한 'auto' 공고의 ID와 충돌하여 500 에러(Unique 제약 조건 위반)가 발생.
      // 따라서 수정 모드가 아닐 때는 externalId를 페이로드에서 제외하여 백엔드에서 새 UUID를 생성.
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
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <form
        onSubmit={(e: React.FormEvent) => handleRegister(e)}
        className="bg-white w-full max-w-2xl rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-8 duration-300"
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {mode === 'edit' ? '공고 수정하기' : '새 공고 등록'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleReset()}
              title="입력 내용 초기화"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            >
              <RotateCcw size={14} />
              초기화
            </button>
            <div className="w-px h-4 bg-gray-100 mx-1" />
            <button
              onClick={onClose}
              aria-label="닫기"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {mode !== 'edit' && (
            <CrawlBar
              url={crawlUrl}
              onUrlChange={setCrawlUrl}
              onParse={handleParse}
              isParsing={isParsing}
            />
          )}

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-6">
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
            <div className="w-full md:w-48 shrink-0">
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
              setDeadline(''); // 상시 모집을 누르거나 취소할 때 날짜 초기화
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

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-bold"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center min-w-35"
              disabled={isSubmitting || isParsing}
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
      </form>
    </div>
  );
};

export default JobModal;
