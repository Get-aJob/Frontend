import type { ResumeFormInputs } from '@/types/ResumeFormType';
import { Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import CharacterCounter from './CharacterCounter';
import TextAreaAutosize from 'react-textarea-autosize';
import ResumeFormDatePicker from './ResumeFormDatePicker';
import clsx from 'clsx';

const ResumeFormEducation = () => {
  const { register, control, setValue, watch } = useFormContext<ResumeFormInputs>();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'education',
  });

  return (
    <div className="w-full mt-20">
      <label className="text-xl ml-2">학력</label>
      {fields.map((field, index) => {
        const inCurrent = watch(`education.${index}.isCurrent`);
        return (
          <div
            key={field.id}
            className="w-full relative flex mt-5 group has-focus:outline-2 outline-btn-point rounded-lg p-3 hover:outline-2"
          >
            <div className="flex-1">
              <input
                {...register(`education.${index}.name`)}
                type="text"
                placeholder="학교 및 기관 명"
                className="w-full outline-none resize-none"
              />
              <div className="w-full flex gap-3">
                <ResumeFormDatePicker
                  name={`education.${index}.period.startDate`}
                  control={control}
                  disabled={false}
                />
                <p>-</p>{' '}
                <ResumeFormDatePicker
                  name={`education.${index}.period.endDate`}
                  control={control}
                  disabled={inCurrent}
                />
                <label className="flex items-center justify-center gap-1">
                  <span className={clsx(!inCurrent ? 'text-black/40' : 'text-black')}>
                    현재 진행 중
                  </span>
                  <input
                    type="checkbox"
                    {...register(`education.${index}.isCurrent`)}
                    onChange={(e) => {
                      e.stopPropagation();
                      const checked = e.target.checked;
                      setValue(`education.${index}.isCurrent`, checked);
                      if (checked) {
                        setValue(`education.${index}.period.endDate`, null);
                      }
                    }}
                  />
                </label>
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
            <div className="absolute -bottom-14 left-[48%] w-14 h-14 p-2 z-20">
              <button
                type="button"
                onClick={() => {
                  append({
                    name: '',
                    period: { startDate: null, endDate: null },
                    description: '',
                    isCurrent: false,
                  });
                }}
                className="w-full h-full rounded-full bg-purple-50 text-outline-point text-3xl text-center justify-center hidden group-hover:flex hover:bg-purple-100 cursor-pointer"
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
                    isCurrent: false,
                  });
                }
              }}
              className="absolute top-4 right-4 w-8 h-8 p-1.5 hidden group-hover:flex items-center justify-center bg-purple-50 rounded-sm hover:bg-purple-100 cursor-pointer"
            >
              <Trash2 className="text-blue-600" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ResumeFormEducation;
