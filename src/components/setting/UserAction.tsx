import React, { useState } from 'react';

interface UserActionProps {
  onLogout: () => void;
  onDeleteAccount: () => void;
  onRequestPasswordReset: (newPassword: string) => Promise<void>;
}

const UserAction: React.FC<UserActionProps> = ({
  onLogout,
  onDeleteAccount,
  onRequestPasswordReset,
}) => {
  const [isResetMode, setIsResetMode] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPassword.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    await onRequestPasswordReset(newPassword);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[16px] font-bold text-[#111827] mb-1">계정 관리</h2>

      <div className="flex flex-col p-5 rounded-xl border border-[#e8eaf0] bg-[#f9fafb] transition-all">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[14px] font-medium text-[#4b5563]">비밀번호 변경</div>
            <div className="text-[12px] text-[#9ca3af] mt-0.5">
              인증 토큰을 통해 비밀번호를 안전하게 변경합니다.
            </div>
          </div>
          {!isResetMode && (
            <button
              onClick={() => setIsResetMode(true)}
              className="px-5 py-2.5 rounded-xl border  border-[#e8eaf0] bg-white text-[13px] font-semibold text-[#4b5563] hover:bg-[#f3f4f6] transition-colors cursor-pointer"
            >
              비밀번호 변경
            </button>
          )}
        </div>

        {isResetMode && (
          <form
            onSubmit={handleResetSubmit}
            className="mt-5 flex flex-col gap-3 animate-[fadeUp_0.2s_ease]"
          >
            <div className="h-px bg-[#e8eaf0] mb-2" />
            <input
              type="password"
              placeholder="새 비밀번호 (8자 이상)"
              className="w-full p-3 rounded-xl border border-[#e8eaf0] bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="새 비밀번호 확인"
              className="w-full p-3 rounded-xl border border-[#e8eaf0] bg-white text-[13px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div className="flex gap-2 mt-1">
              <button
                type="submit"
                className="flex-1 p-3 rounded-xl bg-[#4f46e5] text-white text-[13px] font-bold hover:bg-[#4338ca] transition-colors cursor-pointer"
              >
                변경 확정
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsResetMode(false);
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="px-5 p-3 rounded-xl border border-[#e8eaf0] bg-white text-[13px] font-medium text-[#6b7280] hover:bg-[#f3f4f6] transition-colors cursor-pointer"
              >
                취소
              </button>
            </div>
          </form>
        )}
      </div>

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
