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
    <div className="flex-1 mt-8">
      <div className="px-4 mb-2">
        <label className="text-base font-black text-gray-700 tracking-tight">
          수상/자격증/기타
        </label>
        <div className="w-full mt-2 h-px bg-gray-100" />
      </div>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="w-full relative flex mt-3 group rounded-2xl p-4 hover:bg-gray-50 transition-colors border border-transparent hover:border-border-light"
        >
          <div className="flex-1">
            <input
              {...register(`additionalInfo.${index}.name`)}
              type="text"
              placeholder="활동명"
              className="w-full outline-none resize-none text-sm font-bold text-gray-800 placeholder:text-gray-300 bg-transparent"
            />
            <div className="w-full flex gap-3 items-center mt-1">
              <ResumeFormDatePicker
                name={`additionalInfo.${index}.date`}
                control={control}
                disabled={false}
              />
              <select
                {...register(`additionalInfo.${index}.type`)}
                defaultValue=""
                className="py-1.5 px-2 rounded-lg bg-white border border-border-light text-xs font-bold text-gray-600 hover:border-btn-point appearance-none focus:outline-none focus:ring-2 focus:ring-purple-100 [text-align-last:center] transition-all cursor-pointer"
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
              placeholder="상세 내용을 입력하세요."
              className="w-full outline-none mt-4 resize-none text-sm text-gray-700 placeholder:text-gray-300 bg-transparent"
            />
            <CharacterCounter
              control={control}
              name={`additionalInfo.${index}.description`}
              limit={1000}
            />
          </div>
          <div className="absolute -bottom-5 left-[48%] w-10 h-10 p-1.5">
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
              className="w-full h-full rounded-full bg-white border border-border-light text-btn-point text-xl shadow-sm text-center justify-center hidden group-hover:flex hover:bg-purple-50 hover:border-btn-point cursor-pointer transition-all"
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
            className="absolute top-3 right-3 w-7 h-7 p-1.5 hidden group-hover:flex items-center justify-center bg-white border border-border-light rounded-lg shadow-sm hover:bg-red-50 hover:border-red-200 cursor-pointer transition-all"
          >
            <Trash2 size={14} className="text-gray-400 hover:text-red-400" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ResumeFormAdditionalInfo;
