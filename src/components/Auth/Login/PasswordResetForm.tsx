import React, { useState } from 'react';
import { requestPasswordResetApi, confirmPasswordResetApi } from '@/api/Auth';

interface PasswordResetFormProps {
  onBackToLogin: () => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({ onBackToLogin }) => {
  const [step, setStep] = useState(1);
  const [resetToken, setResetToken] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const isLengthValid = formData.password.length >= 8;
  const isMatchValid =
    formData.password.length > 0 && formData.password === formData.confirmPassword;

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await requestPasswordResetApi({ name: formData.name, email: formData.email });
      setResetToken(res.reset_token);

      setStep(2);
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error) {
      console.error('본인 확인 실패:', error);
      alert('일치하는 사용자 정보가 없습니다.');
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLengthValid || !isMatchValid) return;

    try {
      await confirmPasswordResetApi({ reset_token: resetToken, password: formData.password });
      alert('비밀번호가 성공적으로 변경되었습니다.');
      onBackToLogin();
    } catch (error) {
      console.error('비밀번호 재설정 실패:', error);
      alert('세션이 만료되었습니다. 다시 시도해주세요.');
      setStep(1);
    }
  };

  return (
    <div className="animate-[fadeUp_0.3s_ease]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#111827]">비밀번호 재설정</h2>
        <p className="text-sm text-[#9ca3af] mt-1">
          {step === 1
            ? '가입하신 이름과 이메일을 입력해주세요.'
            : '새로운 비밀번호를 설정해주세요.'}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleRequestToken} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="이름"
            required
            className="w-full p-3.5 rounded-xl border border-[#e8eaf0] bg-[#f9fafb] text-[14px] focus:outline-none focus:border-[#4f46e5] transition-all"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="이메일"
            required
            className="w-full p-3.5 rounded-xl border border-[#e8eaf0] bg-[#f9fafb] text-[14px] focus:outline-none focus:border-[#4f46e5] transition-all"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <button
            type="submit"
            className="w-full p-4 rounded-xl bg-[#4f46e5] text-white font-bold shadow-sm hover:bg-[#4338ca] transition-all cursor-pointer"
          >
            본인 확인
          </button>
        </form>
      ) : (
        <form onSubmit={handleConfirmReset} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <input
              type="password"
              placeholder="새 비밀번호"
              required
              className={`w-full p-3.5 rounded-xl border ${isLengthValid ? 'border-[#e8eaf0]' : 'border-red-400'} bg-[#f9fafb] text-[14px] focus:outline-none focus:border-[#4f46e5] transition-all`}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <div
              className={`text-[11px] ml-1 ${isLengthValid ? 'text-green-500' : 'text-[#9ca3af]'}`}
            >
              {isLengthValid ? '✓ 8자 이상 입력됨' : '• 8자 이상 입력해주세요'}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <input
              type="password"
              placeholder="새 비밀번호 확인"
              required
              className={`w-full p-3.5 rounded-xl border ${isMatchValid ? 'border-[#e8eaf0]' : 'border-red-400'} bg-[#f9fafb] text-[14px] focus:outline-none focus:border-[#4f46e5] transition-all`}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
            <div
              className={`text-[11px] ml-1 ${isMatchValid ? 'text-green-500' : 'text-[#9ca3af]'}`}
            >
              {isMatchValid ? '✓ 비밀번호 일치' : '• 비밀번호가 일치하지 않습니다'}
            </div>
          </div>

          <button
            type="submit"
            disabled={!isLengthValid || !isMatchValid}
            className={`w-full p-4 rounded-xl font-bold text-white transition-all shadow-sm ${!isLengthValid || !isMatchValid ? 'bg-[#cbd5e1] cursor-not-allowed' : 'bg-[#4f46e5] hover:bg-[#4338ca] cursor-pointer'}`}
          >
            비밀번호 변경 완료
          </button>
        </form>
      )}

      <button
        onClick={onBackToLogin}
        className="mt-6 w-full text-center text-[13px] text-[#9ca3af] hover:text-[#6b7280] hover:underline cursor-pointer"
      >
        로그인으로 돌아가기
      </button>
    </div>
  );
};

export default PasswordResetForm;
