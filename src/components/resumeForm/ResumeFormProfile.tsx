import TextAreaAutosize from 'react-textarea-autosize';
import { useFormContext } from 'react-hook-form';
import type { ResumeFormInputs } from '@/types/ResumeFormType';
import CharacterCounter from './CharacterCounter';

const ResumeFormProfile = () => {
  const { register, control } = useFormContext<ResumeFormInputs>();
  return (
    <div className="w-full group rounded-2xl p-4 hover:bg-gray-50 transition-colors border border-transparent hover:border-border-light">
      <label htmlFor="profile" className="text-base font-black text-gray-700 tracking-tight">
        간단 소개
      </label>
      <div className="w-full mt-2 h-px bg-gray-100" />
      <TextAreaAutosize
        id="profile"
        {...register('profile')}
        maxLength={5000}
        className="w-full outline-none mt-4 resize-none min-h-40 text-sm text-gray-800 placeholder:text-gray-300"
        placeholder="본인을 간단히 소개해주세요."
      />
      <CharacterCounter control={control} name="profile" limit={5000} />
    </div>
  );
};

export default ResumeFormProfile;
