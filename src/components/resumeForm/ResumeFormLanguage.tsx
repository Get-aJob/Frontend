import type { LanguageLevelType, ResumeFormInputs } from '@/type/ResumeFormType';
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
    <div className="w-full mt-20">
      <label className="text-xl ml-2">언어</label>
      <div className="w-full mt-3 ml-2 h-px bg-black/40" />
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="w-full relative flex mt-5 group has-focus:outline-2 outline-blue-200 rounded-lg p-3 hover:outline-2"
        >
          <div className="flex-1">
            <div className="w-full flex">
              <input
                {...register(`language.${index}.name`)}
                type="text"
                placeholder="언어명"
                className="w-1/3 outline-none resize-none"
              />
              <select
                {...register(`language.${index}.level`)}
                defaultValue=""
                className="py-2 px-1 rounded-md bg-white hover:bg-black/10 appearance-none focus:outline-none [text-align-last:center]"
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

          <div className="absolute -bottom-14 left-[48%] w-14 h-14 p-2">
            <button
              type="button"
              onClick={() => {
                append({
                  name: '',
                  level: undefined,
                  test: [],
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
                  level: undefined,
                  test: [],
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

export default ResumeFormLanguage;
