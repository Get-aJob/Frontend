// src/components/setting/UserInfo.tsx
import React, { useRef } from 'react';
import Badge from '@/components/common/UI/Badge';

interface UserInfoProps {
  name: string;
  email: string;
  profileImageUrl?: string | null;
  provider?: string;
  onUploadImage: (file: File) => void;
  onDeleteImage: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({
  name,
  email,
  profileImageUrl,
  provider,
  onUploadImage,
  onDeleteImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onUploadImage(file);
    e.target.value = '';
  };

  // ✨ 대소문자 무관하게 안전하게 구글 계정 판별
  const isGoogle = provider?.toLowerCase() === 'google';

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 pb-10 mb-10 border-b border-gray-100">
      <div className="relative group shrink-0">
        <div className="flex items-center justify-center w-28 h-28 rounded-full bg-btn-point text-[36px] font-black text-white shadow-md overflow-hidden transition-transform group-hover:scale-[1.02]">
          {profileImageUrl ? (
            <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            name?.charAt(0) || '유'
          )}
        </div>

        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-full opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all duration-200">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-white text-[13px] font-bold hover:text-purple-200 transition-colors"
          >
            이미지 변경
          </button>
          {profileImageUrl && (
            <button
              onClick={onDeleteImage}
              className="text-red-300 text-[13px] font-bold hover:text-red-400 transition-colors"
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

      <div className="flex-1 min-w-0 text-center sm:text-left pt-2">
        <h1 className="text-[24px] font-black text-gray-900 truncate tracking-tight">
          {name || '사용자'}
        </h1>
        <p className="text-[15px] text-gray-500 mt-1.5 truncate font-medium">
          {email || '이메일 정보가 없습니다.'}
        </p>

        <div className="mt-4 flex gap-2 justify-center sm:justify-start">
          {isGoogle ? (
            <Badge
              variant="point"
              className="px-4 py-1.5 text-[13px] font-bold bg-[#f2f2f2] !text-gray-700 border-gray-200"
            >
              <span className="flex items-center gap-1.5">
                <img
                  src="/google_icon.png"
                  alt=""
                  className="w-3.5 h-3.5"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                구글 회원
              </span>
            </Badge>
          ) : (
            <Badge variant="point" className="px-4 py-1.5 text-[13px] font-bold">
              일반 회원
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
