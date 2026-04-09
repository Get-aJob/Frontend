import TextAreaAutosize from 'react-textarea-autosize';
import { useFormContext } from 'react-hook-form';
import type { ResumeFormInputs } from '@/types/ResumeFormType';
import CharacterCounter from './CharacterCounter';

const ResumeFormSkill = () => {
  const { register, control } = useFormContext<ResumeFormInputs>();
  return (
    <div className="w-full mt-8 group rounded-2xl p-4 hover:bg-gray-50 transition-colors border border-transparent hover:border-border-light">
      <label htmlFor="skill" className="text-base font-black text-gray-700 tracking-tight">
        스킬
      </label>
      <div className="w-full mt-2 h-px bg-gray-100" />
      <TextAreaAutosize
        id="skill"
        {...register('skill')}
        maxLength={100}
        placeholder=", 로 구분하여 작성해주세요."
        className="w-full outline-none mt-4 resize-none min-h-10 text-sm text-gray-800 placeholder:text-gray-300"
      />
      <CharacterCounter control={control} name="skill" limit={100} />
    </div>
  );
};

export default ResumeFormSkill;
