import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import CrawlBar from './CrawlBar';
import LogoUpload from './LogoUpload';
import TextInput from './TextInput';
import TextareaInput from './TextareaInput';
import DeadlineInput from './DeadlineInput';

const STYLES = {
  overlay:
    'fixed inset-0 bg-[#111827]/50 backdrop-blur-[3px] z-[1000] flex items-center justify-center transition-opacity duration-200 opacity-100 pointer-events-auto p-4',
  modalContent:
    'bg-white rounded-[16px] p-[20px] sm:p-[30px] w-full max-w-[750px] max-h-[90vh] overflow-y-auto shadow-[0_10px_30px_rgba(0,0,0,0.1)]',
  header: 'flex justify-between items-center mb-[22px]',
  title: 'text-[18px] font-[800] !m-0 flex items-center gap-1.5',
  resetBtn:
    'text-[11.5px] px-[11px] py-[5px] text-[#9ca3af] border border-[#e8eaf0] rounded hover:bg-gray-50 transition-colors',
  topSection: 'flex flex-col sm:grid sm:grid-cols-[160px_1fr] gap-[24px] mb-[20px]',
  logoWrapper: 'flex justify-center sm:block',
  formGroup: 'flex flex-col gap-[13px]',
  gridRow: 'grid grid-cols-1 sm:grid-cols-2 gap-[12px]',
  footer: 'flex justify-end gap-[10px] mt-[20px] pt-[18px] border-t-[1.5px] border-[#e8eaf0]',
  cancelBtn:
    'px-[13px] py-[6px] text-[12px] bg-white text-[#111827] border border-[#e8eaf0] rounded hover:bg-gray-50 transition-colors',
  submitBtn:
    'px-[13px] py-[6px] text-[12px] bg-[#4f46e5] text-white rounded hover:bg-[#4338ca] transition-colors',
};

// Zod Schema 정의
const jobPostSchema = z.object({
  title: z.string().min(1, '공고 제목을 입력해 주세요.'),
  company_name: z.string().min(1, '회사명을 입력해 주세요.'),
  company_logo: z.string().nullable(),
  location: z.string().min(1, '회사 위치를 입력해 주세요.'),
  experience: z.string().min(1, '경력 정보를 입력해 주세요.'),
  deadline: z.string().nullable(),
  source_url: z.string().url('올바른 URL 형식이 아닙니다.').or(z.literal('')),
  content: z.string().optional(),
  source_type: z.string(),
  source_site_name: z.string().nullable(),
});

type JobPostFields = z.infer<typeof jobPostSchema>;

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const JobModal = ({ isOpen, onClose }: JobModalProps) => {
  const [isAlwaysRecruit, setIsAlwaysRecruit] = useState(false);

  const [crawlUrl, setCrawlUrl] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<JobPostFields>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      title: '',
      company_name: '',
      company_logo: null,
      location: '',
      experience: '',
      deadline: null,
      source_url: '',
      content: '',
      source_type: 'manual',
      source_site_name: null,
    },
  });

  const handleReset = () => {
    reset({
      title: '',
      company_name: '',
      company_logo: null,
      location: '',
      experience: '',
      deadline: null,
      source_url: '',
      content: '',
      source_type: 'manual',
      source_site_name: null,
    });
    setIsAlwaysRecruit(false);
    setCrawlUrl('');
  };

  const handleAlwaysRecruitChange = (checked: boolean) => {
    setIsAlwaysRecruit(checked);
    if (checked) {
      setValue('deadline', null);
    }
  };

  const handleClose = () => {
    onClose();
    handleReset();
  };

  const handleParse = () => {
    if (!crawlUrl.trim()) return;
    setIsParsing(true);
    // 파싱 기능 api 연동 전
    setTimeout(() => {
      setIsParsing(false);
      alert(
        'URL 파싱 기능은 아직 준비 중입니다. 입력하신 URL을 공고 URL 필드에 자동으로 채워드렸습니다.',
      );
      setValue('source_url', crawlUrl);
    }, 1000);
  };

  const onSubmit = (data: JobPostFields) => {
    const displayData = {
      ...data,
      company_logo: data.company_logo
        ? data.company_logo.length > 50
          ? `${data.company_logo.substring(0, 50)}... [생략됨]`
          : data.company_logo
        : null,
    };

    alert(JSON.stringify(displayData, null, 2));
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className={STYLES.overlay} onClick={handleClose}>
      <div className={STYLES.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={STYLES.header}>
          <div className={STYLES.title}>
            <Plus size={18} strokeWidth={3} /> 새 공고 등록
          </div>
          <button onClick={handleReset} className={STYLES.resetBtn}>
            초기화
          </button>
        </div>

        <CrawlBar
          url={crawlUrl}
          onUrlChange={setCrawlUrl}
          onParse={handleParse}
          isParsing={isParsing}
        />

        <div className={STYLES.topSection}>
          <Controller
            name="company_logo"
            control={control}
            render={({ field }) => (
              <div className={STYLES.logoWrapper}>
                <LogoUpload value={field.value} onChange={field.onChange} />
              </div>
            )}
          />
          <div className={STYLES.formGroup}>
            <TextInput
              label="공고 제목"
              placeholder="예: 프론트엔드 개발자"
              wrapperClassName="mb-0"
              {...register('title')}
              error={errors.title?.message}
            />
            <div className={STYLES.gridRow}>
              <TextInput
                label="회사명"
                placeholder="예: 네이버"
                wrapperClassName="mb-0"
                {...register('company_name')}
                error={errors.company_name?.message}
              />
              <TextInput
                label="회사위치"
                placeholder="예: 서울 강남구 / 판교 / 재택"
                wrapperClassName="mb-0"
                {...register('location')}
                error={errors.location?.message}
              />
            </div>
          </div>
        </div>

        <div className={STYLES.gridRow}>
          <TextInput
            label="신입/경력"
            placeholder="예: 신입 / 경력(2년 이상)"
            title="신입/경력 유무"
            {...register('experience')}
            error={errors.experience?.message}
          />
          <Controller
            name="deadline"
            control={control}
            render={({ field }) => (
              <DeadlineInput
                isAlwaysRecruit={isAlwaysRecruit}
                onAlwaysRecruitChange={handleAlwaysRecruitChange}
                value={field.value ?? ''}
                onChange={field.onChange}
                error={errors.deadline?.message}
              />
            )}
          />
        </div>

        <TextInput
          label="공고 URL"
          placeholder="https://..."
          {...register('source_url')}
          error={errors.source_url?.message}
        />

        <TextareaInput
          label="상세 메모 (주요업무 / 자격요건 / 우대사항 등)"
          placeholder="공고와 관련된 상세 내용을 입력해 주세요."
          {...register('content')}
          error={errors.content?.message}
        />

        <div className={STYLES.footer}>
          <button className={STYLES.cancelBtn} onClick={handleClose}>
            취소
          </button>
          <button className={STYLES.submitBtn} onClick={handleSubmit(onSubmit)}>
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobModal;
