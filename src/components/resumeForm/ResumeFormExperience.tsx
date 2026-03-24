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
    <div className="w-full mt-20">
      <label className="text-xl ml-2">경험/경력</label>
      {fields.map((field, index) => {
        const isCurrent = watch(`experience.${index}.isCurrent`);
        return (
          <div
            key={field.id}
            className="w-full relative flex mt-5 group has-focus:outline-2 outline-blue-200 rounded-lg p-3 hover:outline-2"
          >
            <div className="flex-1">
              <input
                {...register(`experience.${index}.name`)}
                type="text"
                placeholder="회사명"
                className="w-full outline-none resize-none"
              />
              <div className="w-full flex gap-3">
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
                  <span className={clsx(field.isCurrent ? 'text-black/40' : 'text-black')}>
                    현재 진행 중
                  </span>
                  <input
                    {...register(`experience.${index}.isCurrent`)}
                    type="checkbox"
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setValue(`experience.${index}.isCurrent`, checked);
                      if (checked) {
                        setValue(`experience.${index}.period.endDate`, null);
                      }
                    }}
                  />
                </label>
                <p>|</p>
                <input
                  {...register(`experience.${index}.position`)}
                  type="text"
                  placeholder="직무"
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
            <div className="absolute -bottom-14 left-[48%] w-14 h-14 p-2">
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
                    position: '',
                    period: { startDate: null, endDate: null },
                    description: '',
                    isCurrent: false,
                  });
                }
              }}
              className="absolute top-4 right-4 w-8 h-8 p-1.5 hidden group-hover:flex items-center justify-center bg-blue-100 rounded-sm hover:bg-blue-200"
            >
              <Trash2 className="text-blue-600" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ResumeFormExperience;
