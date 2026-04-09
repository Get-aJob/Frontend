import type { ResumeFormInputs } from '@/types/ResumeFormType';
import { Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import ResumeFormDatePicker from './ResumeFormDatePicker';

const AddLanguageTest = ({ fieldIndex }: { fieldIndex: number }) => {
  const { register, control } = useFormContext<ResumeFormInputs>();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: `language.${fieldIndex}.test`,
  });

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => {
          append({ testName: '', score: '', date: null });
        }}
        className="text-xs font-bold text-btn-point hover:bg-purple-50 px-2 py-1 rounded-lg transition-colors"
      >
        + 어학시험 추가
      </button>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="w-full group relative p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all mt-1"
        >
          <div className="flex gap-2 items-center">
            <input
              {...register(`language.${fieldIndex}.test.${index}.testName`)}
              type="text"
              placeholder="시험명"
              className="text-xs text-gray-700 placeholder:text-gray-300 outline-none bg-transparent border-b border-border-light pb-0.5 focus:border-btn-point transition-colors w-24"
            />
            <input
              {...register(`language.${fieldIndex}.test.${index}.score`)}
              type="text"
              placeholder="점수/등급"
              className="text-xs text-gray-700 placeholder:text-gray-300 outline-none bg-transparent border-b border-border-light pb-0.5 focus:border-btn-point transition-colors w-20"
            />
          </div>
          <ResumeFormDatePicker
            name={`language.${fieldIndex}.test.${index}.date`}
            control={control}
            disabled={false}
          />
          <button
            type="button"
            onClick={() => {
              if (fields.length === 1) {
                append({
                  testName: '',
                  score: '',
                  date: null,
                });
              }
              remove(index);
            }}
            className="absolute top-2 right-2 w-6 h-6 p-1 hidden group-hover:flex items-center justify-center bg-white border border-border-light rounded-md shadow-sm hover:bg-red-50 hover:border-red-200 transition-all"
          >
            <Trash2 size={12} className="text-gray-400" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AddLanguageTest;
