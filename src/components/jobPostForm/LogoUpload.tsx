import React, { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';

interface LogoUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const LogoUpload: React.FC<LogoUploadProps> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB 제한

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > MAX_FILE_SIZE) {
      alert('파일 크기는 2MB를 초과할 수 없습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onChange(reader.result);
    };
    reader.onerror = () => onChange(null);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      role="button"
      tabIndex={0}
      title="회사 로고 업로드 (이미지 파일만 가능)"
      className={`w-[160px] h-[160px] border-[2px] border-solid rounded-[12px] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 relative overflow-hidden group
        ${
          isDragging
            ? 'border-[#4f46e5] bg-[#f5f3ff]'
            : 'bg-[#f8f9fc] border-[#e8eaf0] hover:border-[#4f46e5] hover:bg-[#f5f3ff]'
        }`}
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
      <div
        className={`mb-[8px] transition-colors duration-200 ${isDragging ? 'text-[#4f46e5]' : 'text-[#9ca3af]'}`}
      >
        <Camera size={24} />
      </div>
      <div className="text-[11px] text-[#6b7280] text-center px-[10px] leading-[1.4]">
        회사 로고 업로드
        <br />
        <span
          className={`text-[10px] transition-colors duration-200 ${isDragging ? 'text-[#4f46e5] font-medium' : 'text-[#9ca3af]'}`}
        >
          드래그 앤 드롭 또는 클릭
        </span>
      </div>
      {value && (
        <>
          <img
            src={value}
            className="absolute inset-0 w-full h-full object-contain bg-white block"
            alt="로고 미리보기"
          />
          <button
            type="button"
            aria-label="로고 삭제"
            onClick={handleRemove}
            title="삭제"
            className="absolute top-[6px] right-[6px] w-[20px] h-[20px] bg-black/50 text-white rounded-full hidden items-center justify-center cursor-pointer z-10 group-hover:flex hover:bg-black/70"
          >
            <X size={12} />
          </button>
        </>
      )}
    </div>
  );
};

export default LogoUpload;
