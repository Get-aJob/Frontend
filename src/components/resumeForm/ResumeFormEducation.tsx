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
    <div className="w-full mt-8">
      <div className="px-4 mb-2">
        <label className="text-base font-black text-gray-700 tracking-tight">학력</label>
        <div className="w-full mt-2 h-px bg-gray-100" />
      </div>
      {fields.map((field, index) => {
        const inCurrent = watch(`education.${index}.isCurrent`);
        const startDate = watch(`education.${index}.period.startDate`);
        const endDate = watch(`education.${index}.period.endDate`);
        return (
          <div
            key={field.id}
            className="w-full relative flex mt-3 group rounded-2xl p-4 hover:bg-gray-50 transition-colors border border-transparent hover:border-border-light"
          >
            <div className="flex-1">
              <input
                {...register(`education.${index}.name`)}
                type="text"
                placeholder="학교 및 기관 명"
                className="w-full outline-none resize-none text-sm font-bold text-gray-800 placeholder:text-gray-300 bg-transparent"
              />
              <div className="w-full flex gap-3 mt-1 items-center">
                <ResumeFormDatePicker
                  name={`education.${index}.period.startDate`}
                  control={control}
                  disabled={false}
                  maxDate={endDate}
                />
                <p className="text-gray-300 text-sm">-</p>{' '}
                <ResumeFormDatePicker
                  name={`education.${index}.period.endDate`}
                  control={control}
                  disabled={inCurrent}
                  minDate={startDate}
                />
                <label className="flex items-center justify-center gap-1 ml-1">
                  <span
                    className={clsx(
                      'text-xs font-semibold',
                      !inCurrent ? 'text-gray-300' : 'text-btn-point',
                    )}
                  >
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
                className="w-full outline-none mt-4 resize-none text-sm text-gray-700 placeholder:text-gray-300 bg-transparent"
              />
              <CharacterCounter
                control={control}
                name={`education.${index}.description`}
                limit={1000}
              />
            </div>
            <div className="absolute -bottom-5 left-[48%] w-10 h-10 p-1.5 z-20">
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
                className="w-full h-full rounded-full bg-white border border-border-light text-btn-point text-xl shadow-sm text-center justify-center hidden group-hover:flex hover:bg-purple-50 hover:border-btn-point cursor-pointer transition-all"
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
              className="absolute top-3 right-3 w-7 h-7 p-1.5 hidden group-hover:flex items-center justify-center bg-white border border-border-light rounded-lg shadow-sm hover:bg-red-50 hover:border-red-200 cursor-pointer transition-all"
            >
              <Trash2 size={14} className="text-gray-400 hover:text-red-400" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ResumeFormEducation;
