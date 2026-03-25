import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { Trash2, Upload } from 'lucide-react';

interface ResumeFormDropzoneProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
}

interface DropzoneBoxProps {
  value: File | null | undefined;
  onChange: (file: File | null) => void;
}

const ResumeFormDropzone = <T extends FieldValues>({
  name,
  control,
}: ResumeFormDropzoneProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => <DropzoneBox value={value} onChange={onChange} />}
    />
  );
};

const DropzoneBox = ({ value, onChange }: DropzoneBoxProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => onChange(files[0]),
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });
  return value ? (
    <div className="relative p-10 w-fit my-5 text-center justify-center border rounded-2xl hover:bg-black/10 border-black/20">
      <embed
        src={`${URL.createObjectURL(value)}#toolbar=0&navpanes=0&scrollbar=0`}
        type="application/pdf"
        className="border h-85"
      />
      <button
        type="button"
        onClick={() => {
          onChange(null);
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
