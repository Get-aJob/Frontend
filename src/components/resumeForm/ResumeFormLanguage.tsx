import type { LanguageLevelType, ResumeFormInputs } from '@/types/ResumeFormType';
import { Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import AddLanguageTest from './AddLanguageTest';

const ResumeFormLanguage = () => {
  const { register, control } = useFormContext<ResumeFormInputs>();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'language',
  });

  const typeOption: { value: LanguageLevelType; label: string }[] = [
    { value: '유창함', label: '유창함' },
    { value: '고급 비즈니스 레벨', label: '고급 비즈니스 레벨' },
    { value: '비즈니스 레벨', label: '비즈니스 레벨' },
    { value: '일상 회화', label: '일상 회화' },
  ];

  return (
    <div className="flex-1 min-w-0 mt-8">
      <div className="px-4 mb-2">
        <label className="text-base font-black text-gray-700 tracking-tight">언어</label>
        <div className="w-full mt-2 h-px bg-gray-100" />
      </div>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="w-full relative flex mt-3 group rounded-2xl p-4 hover:bg-gray-50 transition-colors border border-transparent hover:border-border-light"
        >
          <div className="flex-1">
            <div className="w-fit flex gap-2 items-center">
              <input
                {...register(`language.${index}.name`)}
                type="text"
                placeholder="언어명"
                className="outline-none resize-none text-sm font-bold text-gray-800 placeholder:text-gray-300 bg-transparent"
              />
              <select
                {...register(`language.${index}.level`)}
                defaultValue=""
                className="py-1.5 px-2 rounded-lg bg-white border border-border-light text-xs font-bold text-gray-600 hover:border-btn-point appearance-none focus:outline-none focus:ring-2 focus:ring-purple-100 [text-align-last:center] transition-all cursor-pointer"
              >
                <option value="" disabled hidden>
                  수준
                </option>
                {typeOption.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <AddLanguageTest fieldIndex={index} />
          </div>

          <div className="absolute -bottom-5 left-[48%] w-10 h-10 p-1.5">
            <button
              type="button"
              onClick={() => {
                append({
                  name: '',
                  level: undefined,
                  test: [],
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
                  level: undefined,
                  test: [],
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

export default ResumeFormLanguage;
