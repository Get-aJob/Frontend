import React from 'react';

interface UserInfoProps {
  name: string;
  email: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ name, email }) => {
  return (
    <div className="flex items-center gap-6 pb-8 mb-8 border-b border-[#f3f4f6]">
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#6366f1] text-[32px] font-extrabold text-white shrink-0 shadow-sm">
        {name ? name.charAt(0) : '유'}
      </div>

      <div className="flex-1 min-w-0">
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
