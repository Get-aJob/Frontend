import type { AdditionalInfoType, ResumeFormInputs } from '@/types/ResumeFormType';
import { Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import TextAreaAutosize from 'react-textarea-autosize';
import CharacterCounter from './CharacterCounter';
import ResumeFormDatePicker from './ResumeFormDatePicker';

const ResumeFormAdditionalInfo = () => {
  const { register, control } = useFormContext<ResumeFormInputs>();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'additionalInfo',
  });

  const typeOption: { value: AdditionalInfoType; label: string }[] = [
    { value: '수상', label: '수상' },
    { value: '자격증', label: '자격증' },
    { value: '활동', label: '활동' },
  ];

  return (
    <div className="flex-1 mt-20">
      <label className="text-xl ml-2">수상/자격증/기타</label>
      <div className="w-full mt-3 ml-2 h-px bg-black/40" />
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="w-full relative flex mt-5 group has-focus:outline-2 outline-blue-200 rounded-lg p-3 hover:outline-2"
        >
          <div className="flex-1">
            <input
              {...register(`additionalInfo.${index}.name`)}
              type="text"
              placeholder="활동명"
              className="w-full outline-none resize-none"
            />
            <div className="w-full flex gap-3 items-center">
              <ResumeFormDatePicker
                name={`additionalInfo.${index}.date`}
                control={control}
                disabled={false}
              />
              <select
                {...register(`additionalInfo.${index}.type`)}
                defaultValue=""
                className="py-2 px-1 rounded-md bg-white hover:bg-black/10 appearance-none focus:outline-none [text-align-last:center]"
              >
                <option value="" disabled hidden>
                  타입
                </option>
                {typeOption.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <TextAreaAutosize
              {...register(`additionalInfo.${index}.description`)}
              maxLength={1000}
              placeholder="description"
              className="w-full outline-none mt-5 resize-none"
            />
            <CharacterCounter
              control={control}
              name={`additionalInfo.${index}.description`}
              limit={1000}
            />
          </div>
          <div className="absolute -bottom-14 left-[48%] w-14 h-14 p-2">
            <button
              type="button"
              onClick={() => {
                append({
                  name: '',
                  date: null,
                  type: undefined,
                  description: '',
                });
              }}
              className="w-full h-full rounded-full bg-blue-100 text-blue-500 text-3xl text-center justify-center hidden group-hover:flex hover:bg-blue-200"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              if (fields.length === 1) {
                append({
                  name: '',
                  date: null,
                  type: undefined,
                  description: '',
                });
              }
              remove(index);
            }}
            className="absolute top-4 right-4 w-8 h-8 p-1.5 hidden group-hover:flex items-center justify-center bg-blue-100 rounded-sm hover:bg-blue-200"
          >
            <Trash2 className="text-blue-600" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ResumeFormAdditionalInfo;
