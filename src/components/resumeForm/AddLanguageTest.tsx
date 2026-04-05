import type { ResumeFormInputs } from '@/types/ResumeFormType';
import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import ResumeFormDatePicker from './ResumeFormDatePicker';

const AddLanguageTest = ({ fieldIndex }: { fieldIndex: number }) => {
  const { register, control } = useFormContext<ResumeFormInputs>();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: `language.${fieldIndex}.test`,
  });

  return (
    <div className="space-y-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-wrap items-center gap-2 relative group/test">
          <input
            {...register(`language.${fieldIndex}.test.${index}.testName`)}
            type="text"
            placeholder="시험명 (예: TOEIC)"
            className="w-40 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-btn-point transition-colors"
          />
          <input
            {...register(`language.${fieldIndex}.test.${index}.score`)}
            type="text"
            placeholder="점수/등급"
            className="w-28 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-btn-point transition-colors"
          />
          <ResumeFormDatePicker
            name={`language.${fieldIndex}.test.${index}.date`}
            control={control}
            disabled={false}
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="p-1.5 text-gray-400 hover:text-status-error rounded-md transition-colors opacity-0 group-hover/test:opacity-100"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ testName: '', score: '', date: null })}
        className="inline-flex items-center gap-1 mt-2 text-sm font-bold text-btn-point hover:text-purple-700 transition-colors px-1"
      >
        <Plus size={14} strokeWidth={3} /> 어학시험 추가
      </button>
    </div>
  );
};

export default AddLanguageTest;
