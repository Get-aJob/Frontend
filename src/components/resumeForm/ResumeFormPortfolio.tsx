import type { ResumeFormInputs } from '@/types/ResumeFormType';
import { Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import ResumeFormDropzone from './ResumeFormDropzone';

const ResumeFormPortfolio = () => {
  const { register, control, setValue, watch } = useFormContext<ResumeFormInputs>();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'portfolio',
  });

  return (
    <div className="w-full my-8 max-lg:mb-45">
      <div className="px-4 mb-2">
        <label className="text-base font-black text-gray-700 tracking-tight">포트폴리오</label>
        <div className="w-full mt-2 h-px bg-gray-100" />
      </div>
      {fields.map((field, index) => {
        const uploadType = watch(`portfolio.${index}.type`);
        return (
          <div
            key={field.id}
            className="w-full relative flex mt-3 group rounded-2xl p-4 hover:bg-gray-50 transition-colors border border-transparent hover:border-border-light"
          >
            <div className="flex-1">
              <input
                {...register(`portfolio.${index}.name`)}
                type="text"
                placeholder="포트폴리오명을 입력해 주세요."
                className="w-full text-sm font-bold text-gray-800 outline-none resize-none placeholder:text-gray-300 bg-transparent"
              />
              <div className="flex gap-3 my-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
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
                  <span className="text-xs font-bold text-gray-500">PDF</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
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
                  <span className="text-xs font-bold text-gray-500">URL</span>
                </label>
              </div>
              {uploadType === 'url' ? (
                <input
                  {...register(`portfolio.${index}.url`)}
                  type="text"
                  placeholder="URL 주소를 입력해 주세요."
                  className="w-full outline-none resize-none text-sm text-gray-700 placeholder:text-gray-300 bg-transparent border-b border-border-light pb-1 focus:border-btn-point transition-colors"
                />
              ) : (
                <ResumeFormDropzone
                  index={index}
                  name={`portfolio.${index}.file`}
                  control={control}
                />
              )}
            </div>
            <div className="absolute -bottom-5 left-[48%] w-10 h-10 p-1.5 z-20">
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
                    url: '',
                    file: null,
                    type: 'file',
                  });
                }
                remove(index);
              }}
              className="absolute top-3 right-3 w-7 h-7 p-1.5 hidden group-hover:flex items-center justify-center bg-white border border-border-light rounded-lg shadow-sm hover:bg-red-50 hover:border-red-200 cursor-pointer transition-all"
            >
              <Trash2 size={14} className="text-gray-400 hover:text-red-400" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ResumeFormPortfolio;
