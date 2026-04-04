import type { ResumeFormInputs } from '@/types/ResumeFormType';
import { Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import TextAreaAutosize from 'react-textarea-autosize';
import CharacterCounter from './CharacterCounter';
import ResumeFormDatePicker from './ResumeFormDatePicker';
import Button from '@/components/common/UI/Button';
import clsx from 'clsx';

const ResumeFormExperience = () => {
  const { register, control, setValue, watch } = useFormContext<ResumeFormInputs>();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'experience',
  });

  return (
    <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mb-10">
      <h2 className="text-subtitle font-bold mb-6 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-btn-point rounded-full" />
        경험 / 경력
      </h2>
      <div className="space-y-4">
        {fields.map((field, index) => {
          const isCurrent = watch(`experience.${index}.isCurrent`);
          return (
            <div
              key={field.id}
              className="relative p-6 rounded-xl border border-gray-100 bg-gray-50/40 group focus-within:border-btn-point focus-within:ring-1 focus-within:bg-white transition-all"
            >
              <div className="flex flex-col gap-4">
                <input
                  {...register(`experience.${index}.name`)}
                  type="text"
                  placeholder="경험 / 회사 명"
                  className="w-full bg-transparent text-lg font-bold text-gray-900 outline-none placeholder:text-gray-300"
                />
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <ResumeFormDatePicker
                    name={`experience.${index}.period.startDate`}
                    control={control}
                    disabled={false}
                  />
                  <span className="text-gray-300">-</span>
                  <ResumeFormDatePicker
                    name={`experience.${index}.period.endDate`}
                    control={control}
                    disabled={isCurrent}
                  />
                  <label className="flex items-center gap-1.5 cursor-pointer ml-2">
                    <input
                      {...register(`experience.${index}.isCurrent`)}
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-btn-point focus:ring-btn-point cursor-pointer"
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setValue(`experience.${index}.isCurrent`, checked);
                        if (checked) setValue(`experience.${index}.period.endDate`, null);
                      }}
                    />
                    <span
                      className={clsx(
                        'text-xs font-medium',
                        isCurrent ? 'text-btn-point font-bold' : 'text-gray-400',
                      )}
                    >
                      현재 진행 중
                    </span>
                  </label>
                  <span className="text-gray-300 ml-2">|</span>
                  <input
                    {...register(`experience.${index}.position`)}
                    type="text"
                    placeholder="포지션 (예: 프론트엔드 개발자)"
                    className="ml-2 flex-1 bg-transparent outline-none placeholder:text-gray-300 font-medium"
                  />
                </div>
                <div className="w-full h-px bg-gray-200 my-1" />
                <TextAreaAutosize
                  {...register(`experience.${index}.description`)}
                  maxLength={5000}
                  placeholder="주요 업무 및 성과를 상세히 작성해주세요."
                  className="w-full outline-none resize-none min-h-[80px] text-[14px] text-gray-700 leading-relaxed bg-transparent placeholder:text-gray-400"
                />
                <div className="flex justify-end">
                  <CharacterCounter
                    control={control}
                    name={`experience.${index}.description`}
                    limit={5000}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-status-error hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="삭제"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border-2 py-6 text-gray-500 hover:text-btn-point hover:border-btn-point hover:bg-purple-50/50 rounded-xl"
          onClick={() =>
            append({
              name: '',
              position: '',
              period: { startDate: null, endDate: null },
              description: '',
              isCurrent: false,
            })
          }
        >
          + 경험 및 경력 추가하기
        </Button>
      </div>
    </section>
  );
};

export default ResumeFormExperience;
