import type { ResumeFormInputs } from '@/type/ResumeFormType';
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
    <div>
      <button
        type="button"
        onClick={() => {
          append({ testName: '', score: '', date: null });
        }}
        className="p-2 hover:bg-black/10 rounded-lg"
      >
        +어학시험 추가
      </button>
      {fields.map((field, index) => (
        <div key={field.id} className="w-full group relative p-2 rounded-xl hover:bg-black/10">
          <div className="flex gap-1">
            <input
              {...register(`language.${fieldIndex}.test.${index}.testName`)}
              type="text"
              placeholder="시험명"
            />
            <input
              {...register(`language.${fieldIndex}.test.${index}.score`)}
              type="text"
              placeholder="점수/등급"
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
            className="absolute top-2 right-2 w-8 h-8 p-1.5 hidden group-hover:flex items-center shadow-sm justify-center bg-white rounded-sm hover:bg-black/5"
          >
            <Trash2 className="text-black" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default AddLanguageTest;
