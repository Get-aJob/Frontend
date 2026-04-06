import TextAreaAutosize from 'react-textarea-autosize';
import { useFormContext } from 'react-hook-form';
import type { ResumeFormInputs } from '@/types/ResumeFormType';
import CharacterCounter from './CharacterCounter';

const ResumeFormProfile = () => {
  const { register, control } = useFormContext<ResumeFormInputs>();

  return (
    <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm transition-all focus-within:border-btn-point focus-within:ring-1 focus-within:ring-btn-point group mb-10">
      <h2 className="text-subtitle font-bold mb-4 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-btn-point rounded-full" />
        간단 소개
      </h2>
      <div className="mt-4">
        <TextAreaAutosize
          id="profile"
          {...register('profile')}
          maxLength={5000}
          placeholder="자신의 강점과 주요 경험을 요약하여 간략하게 소개해주세요."
          className="w-full outline-none resize-none min-h-[140px] text-[15px] text-gray-800 leading-relaxed bg-transparent placeholder:text-gray-400"
        />
      </div>
      <div className="flex justify-end mt-4 pt-4 border-t border-gray-50">
        <CharacterCounter control={control} name="profile" limit={5000} />
      </div>
    </section>
  );
};

export default ResumeFormProfile;
