import TextAreaAutosize from 'react-textarea-autosize';
import { useFormContext } from 'react-hook-form';
import type { ResumeFormInputs } from '@/type/ResumeFormType';
import CharacterCounter from './CharacterCounter';

const ResumeFormProfile = () => {
  const { register, control } = useFormContext<ResumeFormInputs>();
  return (
    <div className="w-full group has-focus:outline-2 outline-blue-200 rounded-lg p-3 hover:outline-2">
      <label htmlFor="profile" className="text-xl">
        간단 소개
      </label>
      <TextAreaAutosize
        id="profile"
        {...register('profile')}
        maxLength={5000}
        className="w-full outline-none mt-5 resize-none min-h-40"
      />
      <CharacterCounter control={control} name="profile" limit={5000} />
    </div>
  );
};

export default ResumeFormProfile;
