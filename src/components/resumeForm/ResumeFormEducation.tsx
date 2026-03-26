import type { ResumeFormInputs } from '@/types/ResumeFormType';
import { Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import CharacterCounter from './CharacterCounter';
import TextAreaAutosize from 'react-textarea-autosize';

const ResumeFormEducation = () => {
  const { register, control } = useFormContext<ResumeFormInputs>();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'education',
  });

  return (
    <div className="w-full mt-20">
      <label className="text-xl ml-2">학력</label>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="w-full relative flex mt-5 group has-focus:outline-2 outline-blue-200 rounded-lg p-3 hover:outline-2"
        >
          <div className="flex-1">
            <input
              {...register(`education.${index}.name`)}
              type="text"
              placeholder="학교 및 기관 명"
              className="w-full outline-none resize-none"
            />
            <div className="w-full flex">
              <input
                {...register(`education.${index}.period.startDate`, { valueAsDate: true })}
                type="date"
              />
              <p>-</p>{' '}
              <input
                {...register(`education.${index}.period.endDate`, { valueAsDate: true })}
                type="date"
              />
            </div>
            <TextAreaAutosize
              {...register(`education.${index}.description`)}
              maxLength={1000}
              placeholder="이수 과목 또는 연구 내용을 작성해보세요."
              className="w-full outline-none mt-5 resize-none"
            />
            <CharacterCounter
              control={control}
              name={`education.${index}.description`}
              limit={1000}
            />
          </div>
          <div className="absolute -bottom-14 left-[48%] w-14 h-14 p-2">
            <button
              type="button"
              onClick={() => {
                append({
                  name: '',
                  period: { startDate: null, endDate: null },
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
              remove(index);
              if (fields.length === 1) {
                append({
                  name: '',
                  period: { startDate: null, endDate: null },
                  description: '',
                });
              }
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

export default ResumeFormEducation;
