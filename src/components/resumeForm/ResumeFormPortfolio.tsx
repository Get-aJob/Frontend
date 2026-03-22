import type { ResumeFormInputs } from '@/types/ResumeFormType';
import { Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

const ResumeFormWorkPortfolio = () => {
  const { register, control } = useFormContext<ResumeFormInputs>();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'portfolio',
  });

  return (
    <div className="w-full mt-20">
      <label className="text-xl ml-2">포트폴리오</label>
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="w-full relative flex mt-5 group has-focus:outline-2 outline-blue-200 rounded-lg p-3 hover:outline-2"
        >
          <div className="flex-1">
            <input
              {...register(`portfolio.${index}.name`)}
              type="text"
              placeholder="포트폴리오명을 입력해 주세요."
              className="w-full outline-none resize-none"
            />
            <input
              {...register(`portfolio.${index}.url`)}
              type="text"
              placeholder="URL주소를 입력해 주세요."
              className="w-full outline-none resize-none"
            />
          </div>
          <div className="absolute -bottom-14 left-[48%] w-14 h-14 p-2">
            <button
              type="button"
              onClick={() => {
                append({
                  name: '',
                  url: '',
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
                  url: '',
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

export default ResumeFormWorkPortfolio;
