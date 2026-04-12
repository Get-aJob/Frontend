import { useForm, FormProvider } from 'react-hook-form';
import ResumeFormTopbar from '@/components/resumeForm/ResumeFormTopbar';
import type { ResumeFormInputs } from '@/types/ResumeFormType';
import ResumeFormProfile from '@/components/resumeForm/ResumeFormProfile';
import ResumeFormEducation from '@/components/resumeForm/ResumeFormEducation';
import ResumeFormAdditionalInfo from '@/components/resumeForm/ResumeFormAdditionalInfo';
import ResumeFormSkill from '@/components/resumeForm/ResumeFormSkill';
import ResumeFormLanguage from '@/components/resumeForm/ResumeFormLanguage';
import ResumeFormExperience from '@/components/resumeForm/ResumeFormExperience';
import { usePreviewStore } from '@/store/usePdfPreviewStore';
import PortFolioPreview from '@/components/resumeForm/PortFolioPreview';
import { useAuthStore } from '@/store/useAuthStore';
import ResumeFormPortfolio from '@/components/resumeForm/ResumeFormPortfolio';
import { useShallow } from 'zustand/react/shallow';

const ResumeForm = () => {
  const resume = useForm<ResumeFormInputs>({
    defaultValues: {
      title: '',
      profile: '',
      experience: [
        {
          name: '',
          position: '',
          period: { startDate: null, endDate: null },
          description: '',
          isCurrent: false,
        },
      ],
      education: [
        {
          name: '',
          period: { startDate: null, endDate: null },
          description: '',
          isCurrent: false,
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
      portfolio: [{ name: '', url: '', file: null, type: 'file' }],
    },
  });
  const user = useAuthStore((state) => state.user);
  const { isOpen, name } = usePreviewStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      name: state.name,
    })),
  );

  return (
    <div className="w-full h-dvh overflow-hidden">
      {isOpen && <PortFolioPreview name={name} />}
      <FormProvider {...resume}>
        <ResumeFormTopbar />
        <div className="w-full h-full bg-gray-50 overflow-y-scroll">
          <form className="mx-auto my-auto xl:mx-50 mt-20 lg:mt-16 xl:mt-30 xl:mb-45 p-4 lg:p-10 bg-white border border-border-light shadow-sm rounded-none xl:rounded-3xl">
            <h1 className="text-2xl font-black text-gray-900 mb-6 pl-3 border-l-4 border-btn-point">
              {user?.name}
            </h1>
            <ResumeFormProfile />
            <ResumeFormExperience />
            <ResumeFormSkill />
            <ResumeFormEducation />
            <div className="flex gap-6 w-full max-lg:flex-col max-lg:pr-2">
              <ResumeFormAdditionalInfo />
              <ResumeFormLanguage />
            </div>
            <ResumeFormPortfolio />
          </form>
        </div>
      </FormProvider>
    </div>
  );
};

export default ResumeForm;
