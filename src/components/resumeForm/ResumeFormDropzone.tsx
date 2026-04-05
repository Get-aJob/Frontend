import {
  Controller,
  useFormContext,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { Eye, Trash2, UploadCloud } from 'lucide-react';
import type { pdfType, ResumeFormInputs } from '@/types/ResumeFormType';
import ResumeFormPortfolioItem from './ResumeFormPortfolioItem';
import { usePreviewStore } from '@/store/usePdfPreviewStore';
import clsx from 'clsx';

interface ResumeFormDropzoneProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  index: number;
}

interface DropzoneBoxProps {
  value: pdfType;
  onChange: (file: File | null) => void;
  index: number;
}

const ResumeFormDropzone = <T extends FieldValues>({
  name,
  control,
  index,
}: ResumeFormDropzoneProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <DropzoneBox index={index} value={value} onChange={onChange} />
      )}
    />
  );
};

const DropzoneBox = ({ value, onChange, index }: DropzoneBoxProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => onChange(files[0]),
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const { watch, setValue } = useFormContext<ResumeFormInputs>();
  const { openPreview } = usePreviewStore();
  const portfolio = watch(`portfolio.${index}`);

  return portfolio.file || portfolio.fileUrl ? (
    <div className="group relative p-6 w-full text-center flex items-center justify-between border border-gray-200 bg-white rounded-xl hover:border-btn-point transition-colors">
      <ResumeFormPortfolioItem
        name={portfolio.file ? portfolio.file.name : portfolio.name}
        file={portfolio.file}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openPreview(value || portfolio.fileUrl);
          }}
          className="p-2 text-gray-500 hover:text-btn-point hover:bg-purple-50 rounded-lg transition-colors"
          title="미리보기"
        >
          <Eye size={18} />
        </button>
        <button
          type="button"
          onClick={() => {
            onChange(null);
            setValue(`portfolio.${index}.fileUrl`, undefined);
          }}
          className="p-2 text-gray-500 hover:text-status-error hover:bg-red-50 rounded-lg transition-colors"
          title="파일 삭제"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  ) : (
    <div
      {...getRootProps()}
      className={clsx(
        'flex flex-col items-center justify-center w-full py-10 px-4 border-2 border-dashed rounded-xl cursor-pointer transition-colors',
        isDragActive
          ? 'border-btn-point bg-purple-50/50 text-btn-point'
          : 'border-gray-300 bg-gray-50 text-gray-500 hover:border-btn-point hover:bg-purple-50/20 hover:text-btn-point',
      )}
    >
      <input {...getInputProps()} />
      <UploadCloud size={32} className="mb-3 opacity-80" />
      <p className="font-bold text-sm mb-1">
        {isDragActive
          ? '파일을 여기에 내려놓으세요'
          : '클릭하거나 PDF 파일을 드래그하여 업로드하세요'}
      </p>
      <p className="text-xs text-gray-400 font-medium">최대 10MB까지 업로드 가능</p>
    </div>
  );
};

export default ResumeFormDropzone;
