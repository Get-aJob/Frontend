import type { ResumeFormInputs } from '@/types/ResumeFormType';
import { Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import ResumeFormDropzone from './ResumeFormDropzone';
import Button from '@/components/common/UI/Button';
import clsx from 'clsx';

const ResumeFormPortfolio = () => {
  const { register, control, setValue, watch } = useFormContext<ResumeFormInputs>();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'portfolio',
  });

  return (
    <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mb-10">
      <h2 className="text-subtitle font-bold mb-6 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-btn-point rounded-full" />
        포트폴리오
      </h2>
      <div className="space-y-4">
        {fields.map((field, index) => {
          const uploadType = watch(`portfolio.${index}.type`);
          return (
            <div
              key={field.id}
              className="relative p-6 rounded-xl border border-gray-100 bg-gray-50/40 group focus-within:border-btn-point focus-within:ring-1 focus-within:bg-white transition-all"
            >
              <div className="flex flex-col gap-4">
                <input
                  {...register(`portfolio.${index}.name`)}
                  type="text"
                  placeholder="포트폴리오 제목을 입력해주세요."
                  className="w-full bg-transparent text-lg font-bold text-gray-900 outline-none placeholder:text-gray-300"
                />

                {/* 탭 형식의 타입 선택 UI */}
                <div className="flex gap-1 bg-gray-200/60 p-1 rounded-lg w-fit mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setValue(`portfolio.${index}.type`, 'file');
                      setValue(`portfolio.${index}.url`, '');
                    }}
                    className={clsx(
                      'px-4 py-1.5 rounded-md text-sm font-bold transition-all',
                      uploadType === 'file'
                        ? 'bg-white shadow-sm text-btn-point'
                        : 'text-gray-500 hover:text-gray-700',
                    )}
                  >
                    PDF 파일 첨부
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setValue(`portfolio.${index}.type`, 'url');
                      setValue(`portfolio.${index}.file`, null);
                    }}
                    className={clsx(
                      'px-4 py-1.5 rounded-md text-sm font-bold transition-all',
                      uploadType === 'url'
                        ? 'bg-white shadow-sm text-btn-point'
                        : 'text-gray-500 hover:text-gray-700',
                    )}
                  >
                    URL 링크
                  </button>
                </div>

                {/* 첨부 영역 */}
                <div className="mt-2">
                  {uploadType === 'url' ? (
                    <input
                      {...register(`portfolio.${index}.url`)}
                      type="text"
                      placeholder="https:// URL 주소를 입력해주세요."
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-btn-point transition-colors"
                    />
                  ) : (
                    <ResumeFormDropzone
                      index={index}
                      name={`portfolio.${index}.file`}
                      control={control}
                    />
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-status-error hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="삭제"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border-2 py-6 text-gray-500 hover:text-btn-point hover:border-btn-point hover:bg-purple-50/50 rounded-xl"
          onClick={() => append({ name: '', url: '', file: null, type: 'file' })}
        >
          + 포트폴리오 추가하기
        </Button>
      </div>
    </section>
  );
};

export default ResumeFormPortfolio;
