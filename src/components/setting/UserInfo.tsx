import React, { useRef } from 'react';

interface UserInfoProps {
  name: string;
  email: string;
  profileImageUrl?: string | null;
  onUploadImage: (file: File) => void;
  onDeleteImage: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({
  name,
  email,
  profileImageUrl,
  onUploadImage,
  onDeleteImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 mb-8 border-b border-[#f3f4f6]">
      <div className="relative group cursor-pointer">
        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-[#6366f1] text-[32px] font-extrabold text-white shrink-0 shadow-sm overflow-hidden">
          {profileImageUrl ? (
            <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : name ? (
            name.charAt(0)
          ) : (
            '유'
          )}
        </div>

        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-opacity">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-white text-[12px] font-medium hover:underline"
          >
            이미지 변경
          </button>
          {profileImageUrl && (
            <button
              onClick={onDeleteImage}
              className="text-[#fca5a5] text-[12px] font-medium hover:underline"
            >
              삭제
            </button>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </div>

      <div className="flex-1 min-w-0 text-center sm:text-left mt-2 sm:mt-0">
        <div className="text-[20px] font-bold text-[#111827] truncate">{name || '사용자'}</div>
        <div className="text-[14px] text-[#6b7280] mt-1 truncate">
          {email || '이메일 정보가 없습니다.'}
        </div>
        <div className="inline-block mt-2.5 px-3 py-1 rounded-full bg-[#f0f9ff] border border-[#b3e0ff] text-[12px] font-medium text-[#0077cc]">
          개인 회원
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
