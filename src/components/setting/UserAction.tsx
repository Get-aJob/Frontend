// src/components/setting/UserAction.tsx
import React, { useState } from 'react';

interface UserActionProps {
  onLogout: () => void;
  onDeleteAccount: () => void;
  onRequestPasswordReset: (newPassword: string) => Promise<void>;
  isGoogle?: boolean; // 구글 계정 여부 props 추가
}

const UserAction: React.FC<UserActionProps> = ({
  onLogout,
  onDeleteAccount,
  onRequestPasswordReset,
  isGoogle,
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
    <div className="space-y-6">
      <h2 className="text-[17px] font-black text-gray-900 mb-2 flex items-center gap-2">
        <span className="w-1.5 h-4 bg-btn-point rounded-full" />
        계정 관리
      </h2>

      {/* 비밀번호 변경 섹션 */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isGoogle
            ? 'border-gray-100 bg-gray-50/50 opacity-70'
            : 'border-gray-100 bg-gray-50/50 focus-within:bg-white focus-within:border-btn-point/30'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[15px] font-bold text-gray-800">비밀번호 변경</div>
            <div className="text-[13px] text-gray-400 mt-1 font-medium">
              {isGoogle
                ? '구글 연동 계정은 비밀번호를 변경할 수 없습니다.'
                : '인증 토큰을 통해 비밀번호를 안전하게 변경합니다.'}
            </div>
          </div>
          {!isResetMode && (
            <button
              onClick={() => setIsResetMode(true)}
              disabled={isGoogle} // ✨ 구글 계정이면 클릭 방지
              className={`px-5 py-2.5 rounded-xl border text-[13px] font-bold transition-all shadow-sm ${
                isGoogle
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-btn-point hover:text-btn-point active:scale-95'
              }`}
            >
              변경하기
            </button>
          )}
        </div>

        {isResetMode && !isGoogle && (
          <form onSubmit={handleResetSubmit} className="mt-6 space-y-3 animate-[fadeUp_0.2s_ease]">
            <div className="w-full h-px bg-gray-100 mb-4" />
            <input
              type="password"
              placeholder="새 비밀번호 (8자 이상)"
              className="w-full p-3.5 rounded-xl border border-gray-200 bg-white text-[14px] outline-none focus:border-btn-point focus:ring-2 focus:ring-btn-point/10 transition-all"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="새 비밀번호 확인"
              className="w-full p-3.5 rounded-xl border border-gray-200 bg-white text-[14px] outline-none focus:border-btn-point focus:ring-2 focus:ring-btn-point/10 transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="flex-1 p-3.5 rounded-xl bg-btn-point text-white text-[14px] font-bold hover:opacity-90 transition-all active:scale-[0.98]"
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
                className="px-6 p-3.5 rounded-xl border border-gray-200 bg-white text-[14px] font-bold text-gray-500 hover:bg-gray-50 transition-all"
              >
                취소
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 로그아웃 섹션 */}
      <div className="flex items-center justify-between p-6 rounded-2xl border border-gray-100 bg-gray-50/50">
        <div>
          <div className="text-[15px] font-bold text-gray-800">로그아웃</div>
          <div className="text-[13px] text-gray-400 mt-1 font-medium">
            현재 기기에서 로그아웃합니다.
          </div>
        </div>
        <button
          onClick={onLogout}
          className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-[13px] font-bold text-gray-600 hover:border-btn-point hover:text-btn-point transition-all shadow-sm active:scale-95"
        >
          로그아웃
        </button>
      </div>

      {/* 회원탈퇴 섹션 */}
      <div className="flex items-center justify-between p-6 rounded-2xl border border-red-100 bg-red-50/30">
        <div>
          <div className="text-[15px] font-bold text-red-500">회원탈퇴</div>
          <div className="text-[13px] text-red-400 mt-1 font-medium">
            계정을 삭제하며 데이터는 복구할 수 없습니다.
          </div>
        </div>
        <button
          onClick={onDeleteAccount}
          className="px-5 py-2.5 rounded-xl bg-red-500 text-[13px] font-bold text-white hover:bg-red-600 transition-all shadow-sm active:scale-95"
        >
          회원탈퇴
        </button>
      </div>
    </div>
  );
};

export default UserAction;
