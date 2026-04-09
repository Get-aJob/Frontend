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
import { downloadPortfolio } from '@/features/pdf/utiles/generatePdf';

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
  const MAX_SIZE = 50 * 1024 * 1024;
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxSize: MAX_SIZE,
    onDrop: (files) => onChange(files[0]),
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  const { watch, setValue } = useFormContext<ResumeFormInputs>();
  const openPreview = usePreviewStore((state) => state.openPreview);

  const portfolio = watch(`portfolio.${index}`);

  return portfolio.file || portfolio.fileUrl ? (
    <div className="group relative p-6 w-full my-2 text-center justify-center border border-border-light rounded-2xl hover:border-btn-point hover:bg-gray-50 transition-all">
      <ResumeFormPortfolioItem
        name={portfolio.file ? portfolio.file.name : portfolio.name}
        file={portfolio.file}
      />
      <button
        type="button"
        onClick={async () => {
          await downloadPortfolio(
            portfolio.file ? portfolio.file : portfolio.fileUrl,
            portfolio.name,
          );
        }}
        className="absolute top-3 right-24 w-7 h-7 p-1.5 hidden group-hover:flex items-center shadow-sm justify-center bg-white border border-border-light rounded-lg hover:bg-gray-100 transition-all"
      >
        <Download size={14} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          openPreview(value || portfolio.fileUrl, portfolio.name);
        }}
        className="absolute top-3 right-14 w-7 h-7 p-1.5 hidden group-hover:flex items-center shadow-sm justify-center bg-white border border-border-light rounded-lg hover:bg-gray-100 transition-all"
      >
        <Eye size={14} />
      </button>
      <button
        type="button"
        onClick={() => {
          onChange(null);
          setValue(`portfolio.${index}.fileUrl`, undefined);
        }}
        className="absolute top-3 right-4 w-7 h-7 p-1.5 hidden group-hover:flex items-center shadow-sm justify-center bg-white border border-border-light rounded-lg hover:bg-red-50 hover:border-red-200 transition-all"
      >
        <Trash2 size={14} className="text-gray-400" />
      </button>
    </div>
  ) : (
    <div {...getRootProps()} className="p-2">
      <input {...getInputProps()} />
      <div className="flex flex-col items-center w-full h-60 my-2 text-center justify-center border-2 border-dashed border-border-light rounded-2xl hover:border-btn-point hover:bg-purple-50/30 transition-all cursor-pointer">
        <Upload size={36} className="text-gray-300 mb-2" />
        <p className="text-sm font-bold text-gray-400">
          {isDragActive ? '여기에 놓으세요!' : 'PDF 파일을 드래그하거나 클릭하세요'}
        </p>
        <p className="text-xs text-gray-300 mt-1">최대 50MB</p>
      </div>
    </div>
  );
};

export default ResumeFormDropzone;
