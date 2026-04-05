import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { useResumeList } from '@/hooks/resume';
import Button from '@/components/common/UI/Button';
import ResumeFormProfile from '@/components/resumeForm/ResumeFormProfile';
import ResumeFormEducation from '@/components/resumeForm/ResumeFormEducation';
import ResumeFormExperience from '@/components/resumeForm/ResumeFormExperience';
import ResumeFormSkill from '@/components/resumeForm/ResumeFormSkill';
import ResumeFormAdditionalInfo from '@/components/resumeForm/ResumeFormAdditionalInfo';
import ResumeFormLanguage from '@/components/resumeForm/ResumeFormLanguage';
import ResumeFormPortfolio from '@/components/resumeForm/ResumeFormPortfolio';
import CharacterCounter from '@/components/resumeForm/CharacterCounter'; // ✅ 글자수 카운터 추가
import { ChevronLeft, Save, Eye } from 'lucide-react';

import type { ResumeFormInputs } from '@/types/ResumeFormType';

const ResumeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: resumes } = useResumeList();
  const [isSaving, setIsSaving] = useState(false);

  const methods = useForm<ResumeFormInputs>({
    defaultValues: {
      title: '',
      profile: '',
      experience: [],
      education: [],
      skill: '',
      additionalInfo: [],
      language: [],
      portfolio: [],
    },
  });

  useEffect(() => {
    if (id && resumes) {
      const data = resumes.find((r) => String(r.id) === String(id));
      if (data && data.content) {
        methods.reset({
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
        });
      }
    }
  }, [id, resumes, methods]);

  const onSubmit = async (data: ResumeFormInputs) => {
    setIsSaving(true);
    try {
      console.log('저장될 데이터:', data);
      // 실제 API 로직 추가 위치
      setTimeout(() => setIsSaving(false), 800);
    } catch (error) {
      console.error('이력서 저장 중 오류 발생:', error);
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-6 animate-[fadeUp_0.3s_ease]">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          {/* 플로팅 상단 바 */}
          <div className="sticky top-6 z-40 bg-white/80 backdrop-blur-xl px-6 py-4 mb-8 border border-gray-200 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex justify-between items-center transition-all">
            <button
              type="button"
              onClick={() => navigate('/resume')}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors font-bold"
            >
              <ChevronLeft size={20} />
              목록으로
            </button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 font-bold bg-white"
              >
                <Eye size={16} /> 미리보기
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="gap-1.5 px-6 font-bold shadow-sm"
                isLoading={isSaving}
              >
                <Save size={16} /> 저장하기
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            {/* ✨ 다른 섹션과 통일된 이력서 제목 카드 */}
            <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-all focus-within:border-btn-point focus-within:ring-1 focus-within:ring-btn-point group">
              <h2 className="text-subtitle font-bold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-btn-point rounded-full" />
                이력서 제목
              </h2>
              <div className="mt-4">
                <input
                  {...methods.register('title')}
                  maxLength={100}
                  type="text"
                  placeholder="직무와 연차가 돋보이는 제목을 작성해주세요 (예: 3년차 프론트엔드 개발자 이규현)"
                  className="w-full outline-none py-3 px-4 border border-gray-200 rounded-xl focus:border-btn-point transition-colors text-[15px] text-gray-800 bg-transparent placeholder:text-gray-400"
                />
              </div>
              <div className="flex justify-end mt-2">
                <CharacterCounter control={methods.control} name="title" limit={100} />
              </div>
            </section>

            {/* 나머지 컴포넌트들 */}
            <ResumeFormProfile />
            <ResumeFormEducation />
            <ResumeFormExperience />
            <ResumeFormSkill />
            <ResumeFormAdditionalInfo />
            <ResumeFormLanguage />
            <ResumeFormPortfolio />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ResumeForm;
