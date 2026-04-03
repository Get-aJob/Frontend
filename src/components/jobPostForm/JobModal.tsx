import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import CrawlBar from './CrawlBar';
import LogoUpload from './LogoUpload';
import TextInput from './TextInput';
import TextareaInput from './TextareaInput';
import DeadlineInput from './DeadlineInput';
import { usePostingStore } from '@/store/usePostingStore';
import type { JobPosting } from '@/types/Posting';

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

const jobPostSchema = z.object({
  title: z.string().min(1, '공고 제목을 입력해 주세요.'),
  company_name: z.string().min(1, '회사명을 입력해 주세요.'),
  company_logo: z.string().nullish(),
  location: z.string().min(1, '회사 위치를 입력해 주세요.'),
  experience: z.string().min(1, '경력 정보를 입력해 주세요.'),
  deadline: z.string().nullish(),
  source_url: z.string().url('올바른 URL 형식이 아닙니다.').or(z.literal('')),
  content: z.string().optional(),
  source_type: z.string().default('direct'),
  source_site_name: z.string().nullish(),
});

type JobPostFields = z.infer<typeof jobPostSchema>;

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit';
  initialData?: JobPosting;
}

interface ParsedJobData {
  title?: string;
  companyName?: string;
  companyLogo?: string;
  location?: string;
  experience?: string;
  sourceUrl?: string;
  content?: {
    requirements?: string;
    preferred?: string;
    description?: string;
    [key: string]: unknown;
  };
  deadlineText?: string;
  deadline?: string;
}

const JobModal = ({ isOpen, onClose, mode = 'create', initialData }: JobModalProps) => {
  const { createJob, updateJob, parseJobUrl, saveParsedJob } = usePostingStore();
  const [isAlwaysRecruit, setIsAlwaysRecruit] = useState(false);
  const [crawlUrl, setCrawlUrl] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedJobData | null>(null);

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
      source_type: 'direct',
      source_site_name: null,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        reset({
          title: initialData.title || '',
          company_name: initialData.companyName || '',
          company_logo: initialData.companyLogo || null,
          location: initialData.location || '',
          experience: initialData.experienceLevel || '',
          deadline: null,
          source_url: initialData.url || '',
          content: initialData.description || '',
          source_type: initialData.sourceType || 'direct',
          source_site_name: null,
        });
        setIsAlwaysRecruit(!initialData.deadline || initialData.deadline.includes('상시'));
      } else {
        handleReset();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mode, initialData]);

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
      source_type: 'direct',
      source_site_name: null,
    });
    setIsAlwaysRecruit(false);
    setCrawlUrl('');
    setParsedData(null);
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

  const handleParse = async () => {
    if (!crawlUrl.trim()) return;
    setIsParsing(true);
    try {
      const data = (await parseJobUrl(crawlUrl)) as ParsedJobData;
      setParsedData(data);
      setValue('title', data.title || '');
      setValue('company_name', data.companyName || '');
      setValue('company_logo', data.companyLogo || '');
      setValue('location', data.location || '');
      setValue('experience', data.experience || '');
      setValue('source_url', data.sourceUrl || crawlUrl);
      setValue('source_type', 'manual');

      const descriptionParts = [];
      if (data.content?.requirements)
        descriptionParts.push(`[지원자격]\n${data.content.requirements}`);
      if (data.content?.preferred) descriptionParts.push(`[우대사항]\n${data.content.preferred}`);
      if (data.content?.description) descriptionParts.push(data.content.description);

      setValue('content', descriptionParts.join('\n\n'));

      if (data.deadlineText === '상시채용') {
        setIsAlwaysRecruit(true);
      } else if (data.deadline) {
        setValue(
          'deadline',
          data.deadline.includes('T') ? data.deadline.split('T')[0] : data.deadline,
        );
        setIsAlwaysRecruit(false);
      }
    } catch (error) {
      console.error(error);
      alert('URL 분석 중 오류가 발생했습니다.');
    } finally {
      setIsParsing(false);
    }
  };

  const onSubmit = async (data: JobPostFields) => {
    try {
      if (data.source_type === 'manual') {
        const requestData = {
          title: data.title,
          companyName: data.company_name,
          externalId:
            mode === 'edit' && initialData?.externalId
              ? initialData.externalId
              : crypto.randomUUID(),
          sourceUrl: data.source_url || '',
          companyLogo: data.company_logo || '',
          location: data.location || undefined,
          experience: data.experience || undefined,
          deadline: data.deadline ? new Date(data.deadline).toISOString() : undefined,
          deadlineText: isAlwaysRecruit ? '상시채용' : undefined,
          content: JSON.stringify({
            ...(parsedData?.content || {}),
            description: data.content,
          }),
        };
        await saveParsedJob(requestData);
        alert(mode === 'edit' ? '성공적으로 수정되었습니다.' : '성공적으로 등록되었습니다.');
      } else {
        const requestData = {
          title: data.title,
          companyName: data.company_name,
          location: data.location,
          experience: data.experience,
          companyLogo: data.company_logo || undefined,
          deadline: data.deadline || undefined,
          deadlineText: isAlwaysRecruit ? '상시채용' : '',
          description: data.content,
          sourceUrl: data.source_url,
        };

        if (mode === 'edit' && initialData?.externalId) {
          await updateJob(initialData.externalId, requestData);
          alert('성공적으로 수정되었습니다.');
        } else {
          await createJob(requestData);
          alert('성공적으로 등록되었습니다.');
        }
      }
      handleClose();
    } catch (error) {
      console.error(error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={STYLES.overlay} onClick={handleClose}>
      <div className={STYLES.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={STYLES.header}>
          <div className={STYLES.title}>
            <Plus size={18} strokeWidth={3} /> {mode === 'create' ? '새 공고 등록' : '공고 수정'}
          </div>
          <button onClick={handleReset} className={STYLES.resetBtn}>
            초기화
          </button>
        </div>

        {mode === 'create' && (
          <CrawlBar
            url={crawlUrl}
            onUrlChange={setCrawlUrl}
            onParse={handleParse}
            isParsing={isParsing}
          />
        )}

        <div className={STYLES.topSection}>
          <Controller
            name="company_logo"
            control={control}
            render={({ field }) => (
              <div className={STYLES.logoWrapper}>
                <LogoUpload value={field.value || ''} onChange={field.onChange} />
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
            {mode === 'create' ? '등록하기' : '수정하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobModal;
