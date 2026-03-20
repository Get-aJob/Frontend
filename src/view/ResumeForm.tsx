import { useForm, FormProvider } from 'react-hook-form';
import ResumeFormTopbar from '@/components/resumeForm/ResumeFormTopbar';
import type { ResumeFormInputs } from '@/type/ResumeFormType';
import ResumeFormProfile from '@/components/resumeForm/ResumeFormProfile';
import ResumeFormWorkHistory from '@/components/resumeForm/ResumeFormWorkHistory';
import ResumeFormEducation from '@/components/resumeForm/ResumeFormEducation';
import ResumeFormAdditionalInfo from '@/components/resumeForm/ResumeFormAdditionalInfo';
import ResumeFormSkill from '@/components/resumeForm/ResumeFormSkill';
import ResumeFormLanguage from '@/components/resumeForm/ResumeFormLanguage';
import ResumeFormWorkPortfolio from '@/components/resumeForm/ResumeFormPortfolio';

const ResumeForm = () => {
  const resume = useForm<ResumeFormInputs>({
    defaultValues: {
      title: '',
      profile: '',
      workHistory: [
        {
          companyName: '',
          position: '',
          period: { startDate: null, endDate: null },
          description: '',
        },
      ],
      education: [
        {
          name: '',
          period: { startDate: null, endDate: null },
          description: '',
        },
      ],
      additionalInfo: [
        {
          name: '',
          date: null,
          type: undefined,
          description: '',
        },
      ],
      skill: '',
      language: [
        {
          name: '',
          level: undefined,
          test: [
            {
              testName: '',
              date: null,
            },
          ],
        },
      ],
      portfolio: [{ name: '', url: '' }],
    },
  });
  return (
    <div className="w-full h-dvh overflow-hidden">
      <FormProvider {...resume}>
        <ResumeFormTopbar />
        <div className="w-full h-full bg-black/5 overflow-y-scroll">
          <form className="mx-50 mt-15 mb-45 p-15 bg-white">
            <ResumeFormProfile />
            <ResumeFormWorkHistory />
            <ResumeFormSkill />
            <ResumeFormEducation />
            <div className="flex gap-6">
              <ResumeFormAdditionalInfo />
              <ResumeFormLanguage />
            </div>
            <ResumeFormWorkPortfolio />
          </form>
        </div>
      </FormProvider>
    </div>
  );
};

export default ResumeForm;
