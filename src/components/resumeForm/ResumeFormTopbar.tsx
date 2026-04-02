import { PATH } from '@/router/Path';
import type { ResumeFormData, ResumeFormInputs, ResumeInfo } from '@/types/ResumeFormType';
import { useFormContext, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Download, LoaderCircle } from 'lucide-react';
import ResumeDownloadButton from './ResumeDownloadButton';
import { useGetResume, useSaveResume, useUploadPortfolio } from '@/hooks/resume';
import { useEffect, useState } from 'react';

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
    <aside className="bg-white">
      <div className="w-full min-h-20 flex justify-between items-center gap-10">
        <button
          type="button"
          onClick={() => {
            navigate(PATH.RESUME);
          }}
          className="flex p-2 mx-5 rounded-xl hover:bg-black/5"
        >
          <ChevronLeft size={18} className="mt-0.5" />
          <p>이전 페이지</p>
        </button>
        <input
          {...register('title')}
          type="text"
          placeholder="제목을 입력하세요."
          className="p-3 rounded-xl shadow-inner"
        />
        <div className="h-full flex w-fit">
          <ResumeDownloadButton
            data={formData}
            className="block py-2 px-3 rounded-xl hover:bg-black/10"
          >
            <Download />
          </ResumeDownloadButton>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="py-2 px-3 border mx-5 rounded-xl text-white bg-blue-400 hover:bg-blue-600"
          >
            {saveResume.isPending ? <LoaderCircle className="animate-spin" /> : '작성 완료'}
          </button>
        </div>
      </div>
      <div className="w-full h-px bg-black/5" />
    </aside>
  );
};

export default ResumeFormTopbar;
