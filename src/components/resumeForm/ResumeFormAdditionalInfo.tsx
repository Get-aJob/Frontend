import type { AdditionalInfoType, ResumeFormInputs } from '@/types/ResumeFormType';
import { Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import TextAreaAutosize from 'react-textarea-autosize';
import CharacterCounter from './CharacterCounter';
import ResumeFormDatePicker from './ResumeFormDatePicker';
import Button from '@/components/common/UI/Button';

const ResumeFormAdditionalInfo = () => {
  const { register, control } = useFormContext<ResumeFormInputs>();
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'additionalInfo',
  });

  const typeOption: { value: AdditionalInfoType; label: string }[] = [
    { value: '수상', label: '수상' },
    { value: '자격증', label: '자격증' },
    { value: '활동', label: '활동' },
  ];

  return (
    <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mb-10">
      <h2 className="text-subtitle font-bold mb-6 flex items-center gap-2">
        <span className="w-1.5 h-5 bg-btn-point rounded-full" />
        수상 / 자격증 / 기타
      </h2>
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative p-6 rounded-xl border border-gray-100 bg-gray-50/40 group focus-within:border-btn-point focus-within:ring-1 focus-within:bg-white transition-all"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <input
                  {...register(`additionalInfo.${index}.name`)}
                  type="text"
                  placeholder="활동/자격증 명"
                  className="flex-1 bg-transparent text-lg font-bold text-gray-900 outline-none placeholder:text-gray-300"
                />
              </div>
              <div className="flex items-center gap-3">
                <ResumeFormDatePicker
                  name={`additionalInfo.${index}.date`}
                  control={control}
                  disabled={false}
                />
                <select
                  {...register(`additionalInfo.${index}.type`)}
                  defaultValue=""
                  className="py-1.5 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:border-btn-point focus:outline-none focus:border-btn-point cursor-pointer transition-colors"
                >
                  <option value="" disabled hidden>
                    타입 선택
                  </option>
                  {typeOption.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full h-px bg-gray-200 my-1" />
              <TextAreaAutosize
                {...register(`additionalInfo.${index}.description`)}
                maxLength={1000}
                placeholder="관련 상세 설명을 작성해주세요."
                className="w-full outline-none resize-none min-h-15 text-[14px] text-gray-700 leading-relaxed bg-transparent placeholder:text-gray-400"
              />
              <div className="flex justify-end">
                <CharacterCounter
                  control={control}
                  name={`additionalInfo.${index}.description`}
                  limit={1000}
                />
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
        ))}

        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border-2 py-6 text-gray-500 hover:text-btn-point hover:border-btn-point hover:bg-purple-50/50 rounded-xl"
          onClick={() => append({ name: '', date: null, type: undefined, description: '' })}
        >
          + 항목 추가하기
        </Button>
      </div>
    </section>
  );
};

export default ResumeFormAdditionalInfo;
