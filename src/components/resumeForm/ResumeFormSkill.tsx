import TextAreaAutosize from 'react-textarea-autosize';
import { useFormContext } from 'react-hook-form';
import type { ResumeFormInputs } from '@/types/ResumeFormType';
import CharacterCounter from './CharacterCounter';

const ResumeFormSkill = () => {
  const { register, control } = useFormContext<ResumeFormInputs>();
  return (
    <div className="w-full mt-20 group has-focus:outline-2 outline-blue-200 rounded-lg p-3 hover:outline-2">
      <label htmlFor="skill" className="text-xl">
        스킬
      </label>
      <TextAreaAutosize
        id="skill"
        {...register('skill')}
        maxLength={100}
        placeholder=", 로 구분하여 작성해주세요."
        className="w-full outline-none mt-5 resize-none min-h-10"
      />
      <CharacterCounter control={control} name="skill" limit={100} />
    </div>
  );
};

export default ResumeFormSkill;
