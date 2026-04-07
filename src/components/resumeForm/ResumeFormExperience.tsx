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
    <div className="w-full mt-20 z-0">
      <label className="text-xl ml-2">경험 / 경력</label>
      {fields.map((field, index) => {
        const isCurrent = watch(`experience.${index}.isCurrent`);
        return (
          <div
            key={field.id}
            className="w-full relative flex mt-5 group has-focus:outline-2 outline-btn-point rounded-lg p-3 hover:outline-2"
          >
            <div className="flex-1">
              <input
                {...register(`experience.${index}.name`)}
                type="text"
                placeholder="경험 / 회사 명"
                className="w-full outline-none resize-none"
              />
              <div className="w-full flex gap-3 max-md:flex-col">
                <div className="w-fit flex gap-1">
                  <ResumeFormDatePicker
                    name={`experience.${index}.period.startDate`}
                    control={control}
                    disabled={false}
                  />
                  <p>-</p>
                  <ResumeFormDatePicker
                    name={`experience.${index}.period.endDate`}
                    control={control}
                    disabled={isCurrent}
                  />
                  <label className="flex items-center justify-center gap-1">
                    <span className={clsx(!isCurrent ? 'text-black/40' : 'text-black')}>
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
                <p className="max-md:hidden">|</p>
                <input
                  {...register(`experience.${index}.position`)}
                  type="text"
                  placeholder="포지션"
                  className="w-40"
                />
              </div>
              <TextAreaAutosize
                {...register(`experience.${index}.description`)}
                maxLength={5000}
                placeholder="description"
                className="w-full outline-none mt-5 resize-none"
              />
              <CharacterCounter
                control={control}
                name={`experience.${index}.description`}
                limit={5000}
              />
            </div>
            <div className="absolute -bottom-14 left-[48%] w-14 h-14 p-2 z-20">
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
                    position: '',
                    period: { startDate: null, endDate: null },
                    description: '',
                    isCurrent: false,
                  });
                }
              }}
              className="absolute top-4 right-4 w-8 h-8 p-1.5 hidden group-hover:flex items-center justify-center bg-purple-50 rounded-sm hover:bg-purple-100 cursor-pointer"
            >
              <Trash2 className="text-outline-point" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ResumeFormExperience;
