import {
  Controller,
  useFormContext,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { Download, Eye, Trash2, Upload } from 'lucide-react';
import type { pdfType, ResumeFormInputs } from '@/types/ResumeFormType';
import ResumeFormPortfolioItem from './ResumeFormPortfolioItem';
import { usePreviewStore } from '@/store/usePdfPreviewStore';

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
    <div className="group relative p-10 w-full my-3 text-center justify-center border rounded-2xl hover:bg-black/10 border-black/20">
      <ResumeFormPortfolioItem name={portfolio.name} file={portfolio.file} />
      <button
        type="button"
        onClick={() => {}}
        className="absolute top-4 right-28 w-8 h-8 p-1.5 hidden group-hover:flex items-center shadow-sm justify-center bg-white rounded-sm hover:bg-gray-200"
      >
        <Download />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          openPreview(value || portfolio.fileUrl);
        }}
        className="absolute top-4 right-16 w-8 h-8 p-1.5 hidden group-hover:flex items-center shadow-sm justify-center bg-white rounded-sm hover:bg-gray-200"
      >
        <Eye />
      </button>
      <button
        type="button"
        onClick={() => {
          onChange(null);
          setValue(`portfolio.${index}.fileUrl`, undefined);
        }}
        className="absolute top-4 right-4 w-8 h-8 p-1.5 hidden group-hover:flex items-center shadow-sm justify-center bg-white rounded-sm hover:bg-gray-200"
      >
        <Trash2 />
      </button>
    </div>
  ) : (
    <div {...getRootProps()} className="p-5">
      <input {...getInputProps()} />
      <div className="flex flex-col items-center w-full h-85 my-5 text-center justify-center border rounded-2xl hover:bg-black/10 border-black/20">
        <Upload size={50} />
        <p>{isDragActive ? '여기에 놓으세요!' : 'PDF 파일을 여기다 드래그 하거나 클릭하세요!'}</p>
      </div>
    </div>
  );
};

export default ResumeFormDropzone;
