import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCcw, X } from 'lucide-react';
import CrawlBar from './CrawlBar';
import LogoUpload from './LogoUpload';
import TextInput from './TextInput';
import TextareaInput from './TextareaInput';
import DeadlineInput from './DeadlineInput';
import { usePostingStore } from '@/store/usePostingStore';
import type { JobPosting, ParsedJobData } from '@/types/Posting';
import Button from '@/components/common/UI/Button';

const jobPostSchema = z.object({
  title: z.string().min(1, '공고 제목을 입력해 주세요.'),
  company_name: z.string().min(1, '회사명을 입력해 주세요.'),
  company_logo: z.string().nullish(),
  location: z.string().min(1, '회사 위치를 입력해 주세요.'),
  experience: z.string().min(1, '경력 정보를 입력해 주세요.'),
  deadline: z.string().nullish(),
  source_url: z.string().url('올바른 URL 형식이 아닙니다.').or(z.literal('')),
  content: z.string().optional(),
  source_type: z.string(),
  source_site_name: z.string().nullish(),
});

type JobPostFields = z.infer<typeof jobPostSchema>;

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit';
  initialData?: JobPosting;
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

  const handleReset = useCallback(() => {
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
  }, [reset]);

  const handleClose = () => {
    onClose();
    handleReset();
  };

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        reset({
          title: initialData.title || '',
          company_name: initialData.companyName || '',
          company_logo: initialData.companyLogo || null,
          location: initialData.location || '',
          experience: initialData.experienceLevel || '',
          deadline:
            initialData.deadline && !initialData.deadline.includes('상시')
              ? initialData.deadline.split('T')[0]
              : null,
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
  }, [isOpen, mode, initialData, reset, handleReset]);

  const handleParse = async () => {
    if (!crawlUrl.trim()) return;
    setIsParsing(true);
    try {
      const data: ParsedJobData = await parseJobUrl(crawlUrl);
      setParsedData(data);
      setValue('title', data.title || '');
      setValue('company_name', data.companyName || '');
      setValue('company_logo', data.companyLogo || '');
      setValue('location', data.location || '');
      setValue('experience', data.experience || '');
      setValue('source_url', data.sourceUrl || crawlUrl);
      setValue('source_type', 'manual');

      const descriptionParts: string[] = [];
      if (data.content?.requirements)
        descriptionParts.push(`[지원자격]\n${data.content.requirements}`);
      if (data.content?.preferred) descriptionParts.push(`[우대사항]\n${data.content.preferred}`);
      if (data.content?.description) descriptionParts.push(data.content.description);
      setValue('content', descriptionParts.join('\n\n'));

      if (data.deadlineText === '상시채용') {
        setIsAlwaysRecruit(true);
        setValue('deadline', null);
      } else if (data.deadline) {
        setValue('deadline', data.deadline.split('T')[0]);
        setIsAlwaysRecruit(false);
      }
    } catch {
      alert('URL 분석 중 오류가 발생했습니다.');
    } finally {
      setIsParsing(false);
    }
  };

  const onSubmit: SubmitHandler<JobPostFields> = async (data) => {
    try {
      if (data.source_type === 'manual') {
        await saveParsedJob({
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
          content: JSON.stringify({ ...(parsedData?.content || {}), description: data.content }),
        });
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
          await updateJob(initialData.externalId, requestData, initialData.sourceType);
        } else {
          await createJob(requestData);
        }
      }
      alert('공고가 저장되었습니다.');
      handleClose();
    } catch {
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-[32px] p-8 sm:p-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
          <div className="text-xl font-black text-gray-900 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-btn-point rounded-full" />
            {mode === 'create' ? '새 공고 등록' : '공고 수정'}
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-btn-point transition-colors"
          >
            <RotateCcw size={14} /> 초기화
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

        <div className="flex flex-col sm:grid sm:grid-cols-[160px_1fr] gap-8 mb-6">
          <Controller
            name="company_logo"
            control={control}
            render={({ field }) => (
              <div className="flex justify-center sm:block">
                <LogoUpload value={field.value || ''} onChange={field.onChange} />
              </div>
            )}
          />
          <div className="flex flex-col gap-4">
            <TextInput
              label="공고 제목"
              placeholder="예: 프론트엔드 개발자"
              {...register('title')}
              error={errors.title?.message}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TextInput
                label="회사명"
                placeholder="예: 네이버"
                {...register('company_name')}
                error={errors.company_name?.message}
              />
              <TextInput
                label="회사위치"
                placeholder="예: 서울 강남구 / 판교"
                {...register('location')}
                error={errors.location?.message}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <TextInput
            label="신입/경력"
            placeholder="예: 신입 / 경력(2년 이상)"
            {...register('experience')}
            error={errors.experience?.message}
          />
          <Controller
            name="deadline"
            control={control}
            render={({ field }) => (
              <DeadlineInput
                isAlwaysRecruit={isAlwaysRecruit}
                onAlwaysRecruitChange={setIsAlwaysRecruit}
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
          label="상세 메모"
          placeholder="공고 상세 내용을 입력해 주세요."
          {...register('content')}
          error={errors.content?.message}
        />

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
          <Button variant="outline" onClick={handleClose} className="px-6">
            취소
          </Button>
          <Button onClick={handleSubmit(onSubmit)} className="px-8 font-black">
            {mode === 'create' ? '등록하기' : '수정하기'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobModal;
