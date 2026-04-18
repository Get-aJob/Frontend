import { PATH } from '@/router/Path';
import type { ResumeFormData, ResumeFormInputs, ResumeInfo } from '@/types/ResumeFormType';
import { useFormContext, type SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Download, LoaderCircle, Save } from 'lucide-react';
import ResumeDownloadButton from './ResumeDownloadButton';
import { useGetResume, useSaveResume, useUploadPortfolio } from '@/hooks/useResume';
import { useEffect, useState } from 'react';
import { dataToResume } from '@/utils/resumeUtils';

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
      const resume = dataToResume(data);
      reset(resume);
    }
  }, [data, reset, resumeId]);

  const onSubmit: SubmitHandler<ResumeFormInputs> = async (data) => {
    if (!data.title) {
      alert('제목을 입력하세요.');
      return;
    }
    const filteredData = {
      ...data,
      additionalInfo: data.additionalInfo.filter(
        (item) => item.name || item.description || item.type,
      ),
    };
    const hasInvalidItem = filteredData.additionalInfo.some((item) => !item.type || !item.date);
    if (hasInvalidItem) {
      alert('입력하신 수상/자격증/기타 항목의 날짜와 타입을 선택해주세요.');
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
      navigate(PATH.RESUME);
    } catch (error) {
      console.error(`저장 중 에러가 발생했습니다: ${error}`);
    }
  };
  return (
    <aside className="bg-white fixed w-full z-50 border-b border-border-light shadow-sm">
      <div className="w-full min-h-16 flex justify-between items-center gap-10 px-2">
        <button
          type="button"
          onClick={() => {
            navigate(PATH.RESUME);
          }}
          className="flex items-center gap-1 p-2 mx-3 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all font-bold text-sm"
        >
          <ChevronLeft size={16} className="mt-0.5" />
          <p className="max-md:hidden">이전 페이지</p>
        </button>
        <input
          {...register('title')}
          type="text"
          placeholder="제목을 입력하세요."
          className="px-3.5 py-2 rounded-xl border-[1.5px] border-border-light text-sm font-bold outline-none transition-all focus:border-btn-point focus:ring-2 focus:ring-purple-100 placeholder:text-gray-400"
        />
        <div className="h-full flex w-fit items-center">
          <ResumeDownloadButton
            data={formData}
            className="p-2 mx-1 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
          >
            <Download size={18} />
          </ResumeDownloadButton>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="flex items-center justify-center gap-2 py-2 px-4 mx-3 rounded-xl text-sm font-bold text-white bg-btn-point hover:scale-105 hover:shadow-md transition-all active:scale-95 disabled:opacity-50 min-w-20"
          >
            {saveResume.isPending ? (
              <LoaderCircle className="animate-spin" size={18} />
            ) : (
              <>
                <p className="hidden lg:block">작성 완료</p>
                <Save className="lg:hidden" size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ResumeFormTopbar;
