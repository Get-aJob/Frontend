import type { ResumeFormInputs } from '@/types/ResumeFormType';
import { Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import TextAreaAutosize from 'react-textarea-autosize';
import CharacterCounter from './CharacterCounter';
import ResumeFormDatePicker from './ResumeFormDatePicker';
import clsx from 'clsx';

const ResumeFormExperience = () => {
  const { register, control, setValue, watch } = useFormContext<ResumeFormInputs>();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'experience',
  });

  return (
    <div className="w-full mt-8 z-0">
      <div className="px-4 mb-2">
        <label className="text-base font-black text-gray-700 tracking-tight">경험 / 경력</label>
        <div className="w-full mt-2 h-px bg-gray-100" />
      </div>
      {fields.map((field, index) => {
        const isCurrent = watch(`experience.${index}.isCurrent`);
        const startDate = watch(`experience.${index}.period.startDate`);
        const endDate = watch(`experience.${index}.period.endDate`);
        return (
          <div
            key={field.id}
            className="w-full relative flex mt-3 group rounded-2xl p-4 hover:bg-gray-50 transition-colors border border-transparent hover:border-border-light"
          >
            <div className="flex-1">
              <input
                {...register(`experience.${index}.name`)}
                type="text"
                placeholder="경험 / 회사 명"
                className="w-full outline-none resize-none text-sm font-bold text-gray-800 placeholder:text-gray-300 bg-transparent"
              />
              <div className="w-full flex gap-3 mt-1 max-md:flex-col">
                <div className="w-fit flex gap-1 items-center">
                  <ResumeFormDatePicker
                    name={`experience.${index}.period.startDate`}
                    control={control}
                    disabled={false}
                    maxDate={endDate}
                  />
                  <p className="text-gray-300 text-sm">-</p>
                  <ResumeFormDatePicker
                    name={`experience.${index}.period.endDate`}
                    control={control}
                    disabled={isCurrent}
                    minDate={startDate}
                  />
                  <label className="flex items-center justify-center gap-1 ml-1">
                    <span
                      className={clsx(
                        'text-xs font-semibold',
                        !isCurrent ? 'text-gray-300' : 'text-btn-point',
                      )}
                    >
                      현재 진행 중
                    </span>
                    <input
                      {...register(`experience.${index}.isCurrent`)}
                      type="checkbox"
                      onChange={(e) => {
                        e.stopPropagation();
                        const checked = e.target.checked;
                        setValue(`experience.${index}.isCurrent`, checked);
                        if (checked) {
                          setValue(`experience.${index}.period.endDate`, null);
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="text-gray-200 max-md:hidden">|</p>
                <input
                  {...register(`experience.${index}.position`)}
                  type="text"
                  placeholder="포지션"
                  className="w-40 text-sm text-gray-600 placeholder:text-gray-300 outline-none bg-transparent"
                />
              </div>
              <TextAreaAutosize
                {...register(`experience.${index}.description`)}
                maxLength={5000}
                placeholder="주요 역할 및 성과를 작성해보세요."
                className="w-full outline-none mt-4 resize-none text-sm text-gray-700 placeholder:text-gray-300 bg-transparent"
              />
              <CharacterCounter
                control={control}
                name={`experience.${index}.description`}
                limit={5000}
              />
            </div>
            <div className="absolute -bottom-5 left-[48%] w-10 h-10 p-1.5 z-20">
              <button
                type="button"
                onClick={() => {
                  append({
                    name: '',
                    position: '',
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
                    position: '',
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

export default ResumeFormExperience;
