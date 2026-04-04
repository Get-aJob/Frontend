import type { LanguageLevelType, ResumeFormInputs } from '@/types/ResumeFormType';
import { Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import AddLanguageTest from './AddLanguageTest';
import Button from '@/components/common/UI/Button';

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
    <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mb-10">
      <h2 className="text-subtitle font-bold mb-6 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-btn-point rounded-full" />
        외국어
      </h2>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative p-6 rounded-xl border border-gray-100 bg-gray-50/40 group focus-within:border-btn-point focus-within:ring-1 focus-within:bg-white transition-all"
          >
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <input
                {...register(`language.${index}.name`)}
                type="text"
                placeholder="언어명 (예: 영어)"
                className="bg-transparent text-lg font-bold text-gray-900 outline-none placeholder:text-gray-300 w-48"
              />
              <select
                {...register(`language.${index}.level`)}
                defaultValue=""
                className="py-1.5 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:border-btn-point focus:outline-none focus:border-btn-point cursor-pointer transition-colors"
              >
                <option value="" disabled hidden>
                  수준 선택
                </option>
                {typeOption.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full h-px bg-gray-200 my-4" />

            <AddLanguageTest fieldIndex={index} />

            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-status-error hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              title="삭제"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border-2 py-6 text-gray-500 hover:text-btn-point hover:border-btn-point hover:bg-purple-50/50 rounded-xl"
          onClick={() => append({ name: '', level: undefined, test: [] })}
        >
          + 외국어 항목 추가하기
        </Button>
      </div>
    </section>
  );
};

export default ResumeFormLanguage;
