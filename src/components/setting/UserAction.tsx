import React from 'react';

interface UserActionProps {
  onLogout: () => void;
  onDeleteAccount: () => void;
}

const UserAction: React.FC<UserActionProps> = ({ onLogout, onDeleteAccount }) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[16px] font-bold text-[#111827] mb-1">계정 관리</h2>

      {/* 로그아웃 섹션 */}
      <div className="flex items-center justify-between p-5 rounded-xl border border-[#e8eaf0] bg-[#f9fafb]">
        <div>
          <div className="text-[14px] font-medium text-[#4b5563]">로그아웃</div>
          <div className="text-[12px] text-[#9ca3af] mt-0.5">현재 기기에서 로그아웃합니다.</div>
        </div>
        <button
          onClick={onLogout}
          className="px-5 py-2.5 rounded-xl border border-[#e8eaf0] bg-white text-[13px] font-semibold text-[#4b5563] hover:bg-[#f3f4f6] transition-colors cursor-pointer"
        >
          로그아웃
        </button>
      </div>

      {/* 회원탈퇴 섹션 */}
      <div className="flex items-center justify-between p-5 rounded-xl border border-[#fee2e2] bg-[#fff5f5]">
        <div>
          <div className="text-[14px] font-medium text-[#ef4444]">회원탈퇴</div>
          <div className="text-[12px] text-[#9ca3af] mt-0.5">
            계정을 삭제하며 데이터는 복구할 수 없습니다.
          </div>
        </div>
        <button
          onClick={onDeleteAccount}
          className="px-5 py-2.5 rounded-xl bg-[#ef4444] text-[13px] font-semibold text-white hover:bg-[#dc2626] transition-colors cursor-pointer shadow-sm"
        >
          회원탈퇴
        </button>
      </div>
    </div>
  );
};

export default UserAction;
