import type { ResumeFormInputs } from '@/types/ResumeFormType';
import { Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import ResumeFormDropzone from './ResumeFormDropzone';

const ResumeFormWorkPortfolio = () => {
  const { register, control, setValue, watch } = useFormContext<ResumeFormInputs>();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'portfolio',
  });

  return (
    <div className="w-full mt-20">
      <label className="text-xl ml-2">포트폴리오</label>
      {fields.map((field, index) => {
        const uploadType = watch(`portfolio.${index}.type`);
        return (
          <div
            key={field.id}
            className="w-full relative flex mt-10 group has-focus:outline-2 outline-blue-200 rounded-lg p-3 hover:outline-2"
          >
            <div className="flex-1">
              <input
                {...register(`portfolio.${index}.name`)}
                type="text"
                placeholder="포트폴리오명을 입력해 주세요."
                className="w-full text-lg outline-none resize-none"
              />
              <div className="flex gap-2 my-1">
                <label>
                  <input
                    type="radio"
                    checked={uploadType === 'file'}
                    name={`uploadType-${index}`}
                    value={'file'}
                    onChange={() => {
                      setValue(`portfolio.${index}.type`, 'file');
                      setValue(`portfolio.${index}.url`, '');
                    }}
                  />
                  <span>pdf</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name={`uploadType-${index}`}
                    checked={uploadType === 'url'}
                    value={'url'}
                    onChange={() => {
                      setValue(`portfolio.${index}.type`, 'url');
                      setValue(`portfolio.${index}.file`, null);
                    }}
                  />
                  <span>url</span>
                </label>
              </div>
              {uploadType === 'url' ? (
                <input
                  {...register(`portfolio.${index}.url`)}
                  type="text"
                  placeholder="URL주소를 입력해 주세요."
                  className="w-full outline-none resize-none"
                />
              ) : (
                <ResumeFormDropzone name={`portfolio.${index}.file`} control={control} />
              )}
            </div>
            <div className="absolute -bottom-14 left-[48%] w-14 h-14 p-2 z-20">
              <button
                type="button"
                onClick={() => {
                  append({
                    name: '',
                    url: '',
                    file: null,
                    type: 'file',
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
                    file: null,
                    type: 'file',
                  });
                }
                remove(index);
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

export default ResumeFormWorkPortfolio;
