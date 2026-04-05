import { useEffect, useState } from 'react';
import { PATH } from '@/router/Path';
import type { ResumeFormData, ResumeFormInputs, ResumeInfo } from '@/types/ResumeFormType';
import { useFormContext, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Download, Save } from 'lucide-react';
import ResumeDownloadButton from './ResumeDownloadButton';
import { useGetResume, useSaveResume, useUploadPortfolio } from '@/hooks/resume';
import Button from '@/components/common/UI/Button';

const ResumeFormTopbar = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const { register, handleSubmit, watch, reset } = useFormContext<ResumeFormInputs>();
  const navigate = useNavigate();
  const formData = watch();
  const [formId, setFormId] = useState(() => resumeId);

  const saveResume = useSaveResume(formId);
  const uploadPortfolio = useUploadPortfolio();
  const { data } = useGetResume(resumeId);

  useEffect(() => {
    if (resumeId && data) {
      const resume: ResumeFormInputs = {
        title: data.title,
        profile: data.content.profile,
        experience: data.content.experience.map((e) => ({ ...e, isCurrent: !e.period.endDate })),
        education: data.content.education.map((e) => ({ ...e, isCurrent: !e.period.endDate })),
        skill: data.content.skill,
        additionalInfo: data.content.additionalInfo,
        language: data.content.language,
        portfolio: data.content.portfolio.map((p) => ({
          name: p.name,
          url: p.url,
          fileUrl: p.fileUrl,
          file: null,
          type: p.fileUrl ? 'file' : 'url',
        })),
      };
      reset(resume);
    }
  }, [data, reset, resumeId]);

  const onSubmit: SubmitHandler<ResumeFormInputs> = async (data) => {
    if (!data.title) {
      alert('제목을 입력하세요.');
      return;
    }
    try {
      const uploadPortfolioResult = await Promise.all(
        data.portfolio.map(async (p) => {
          if (p.file instanceof File) {
            const response = await uploadPortfolio.mutateAsync(p.file);
            return { ...p, fileUrl: response.fileUrl };
          } else {
            return p;
          }
        }),
      );
      const submitData: ResumeFormData = {
        title: data.title,
        resume: {
          profile: data.profile,
          experience: data.experience.map((e) => ({
            name: e.name,
            position: e.position,
            period: e.period,
            description: e.description,
          })),
          education: data.education.map((e) => ({
            name: e.name,
            description: e.description,
            period: e.period,
          })),
          skill: data.skill,
          additionalInfo: data.additionalInfo,
          language: data.language,
          portfolio: uploadPortfolioResult.map((p) => ({
            name: p.name,
            url: p.url,
            fileUrl: p.fileUrl,
          })),
        },
      };
      const response: ResumeInfo = await saveResume.mutateAsync(submitData);

      if (response.id && !resumeId) {
        setFormId(response.id);
      }
    } catch (error) {
      console.error(`저장 중 에러가 발생했습니다: ${error}`);
    }
  };

  return (
    <aside className="sticky top-0 z-40 bg-[#f3f4f6]/80 backdrop-blur-md border-b border-gray-200 mb-8 py-3 px-4 sm:px-8 flex items-center justify-between shadow-sm transition-all -mx-4 sm:-mx-8">
      <button
        type="button"
        onClick={() => navigate(PATH.RESUME)}
        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors font-bold group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
        <span className="hidden sm:inline">목록으로</span>
      </button>

      <div className="flex-1 max-w-md mx-4">
        <input
          {...register('title')}
          type="text"
          placeholder="이력서 제목을 입력하세요 (예: 3년차 프론트엔드 이규현)"
          className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-btn-point focus:ring-1 focus:ring-btn-point transition-all placeholder:font-medium placeholder:text-gray-400 shadow-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <ResumeDownloadButton
          data={formData}
          className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 text-sm font-bold border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors active:scale-95"
        >
          <Download size={16} />
          <span className="hidden sm:inline">PDF 다운로드</span>
        </ResumeDownloadButton>
        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          variant="primary"
          className="gap-1.5 px-4 sm:px-6 font-bold"
          isLoading={saveResume.isPending}
        >
          <Save size={16} />
          <span className="hidden sm:inline">저장하기</span>
        </Button>
      </div>
    </aside>
  );
};

export default ResumeFormTopbar;
