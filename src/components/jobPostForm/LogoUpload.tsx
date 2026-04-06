import React, { useRef } from 'react';
import { Camera, X } from 'lucide-react';

interface LogoUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const LogoUpload: React.FC<LogoUploadProps> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      className="w-40 h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 relative overflow-hidden group bg-gray-50 border-gray-200 hover:border-btn-point hover:bg-purple-50/30"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
        hidden
        accept="image/*"
      />

      {!value ? (
        <>
          <div className="mb-2 text-gray-400 group-hover:text-btn-point transition-colors">
            <Camera size={28} />
          </div>
          <div className="text-[11px] text-gray-500 font-bold text-center px-4 leading-relaxed">
            로고 업로드
          </div>
        </>
      ) : (
        <>
          <img
            src={value}
            className="absolute inset-0 w-full h-full object-contain bg-white p-2"
            alt="Preview"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className="absolute top-2 right-2 w-6 h-6 bg-red-500/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
          >
            <X size={14} />
          </button>
        </>
      )}
    </div>
  );
};

export default LogoUpload;
