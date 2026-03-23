import React, { useRef } from 'react';
import { Camera, X } from 'lucide-react';

interface LogoUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const LogoUpload: React.FC<LogoUploadProps> = ({ value, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
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
      title="회사 로고 업로드 (이미지 파일만 가능)"
      className="w-[160px] h-[160px] bg-[#f8f9fc] border-[2px] border-dashed border-[#e8eaf0] rounded-[12px] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 relative overflow-hidden hover:border-[#4f46e5] hover:bg-[#f5f3ff] group"
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} hidden accept="image/*" />
      <div className="mb-[8px] text-[#9ca3af]">
        <Camera size={24} />
      </div>
      <div className="text-[11px] text-[#6b7280] text-center px-[10px] leading-[1.4]">
        회사 로고 업로드
        <br />
        <span className="text-[10px] text-[#9ca3af]">드래그 앤 드롭 또는 클릭</span>
      </div>

      {value && (
        <>
          <img
            src={value}
            className="absolute inset-0 w-full h-full object-contain bg-white block"
            alt="로고 미리보기"
          />
          <div
            onClick={handleRemove}
            title="삭제"
            className="absolute top-[6px] right-[6px] w-[20px] h-[20px] bg-black/50 text-white rounded-full hidden items-center justify-center cursor-pointer z-10 group-hover:flex hover:bg-black/70"
          >
            <X size={12} />
          </div>
        </>
      )}
    </div>
  );
};

export default LogoUpload;
