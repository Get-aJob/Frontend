import React, { useState } from 'react';
import { requestPasswordResetApi, confirmPasswordResetApi } from '@/api/Auth';
import Input from '@/components/common/UI/Input';
import Button from '@/components/common/UI/Button';

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
    <div className="animate-[fadeUp_0.3s_ease] w-85 mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-title font-bold text-gray-900">비밀번호 재설정</h2>
        <p className="text-sm text-gray-500 mt-1">
          {step === 1
            ? '가입하신 이름과 이메일을 입력해주세요.'
            : '새로운 비밀번호를 설정해주세요.'}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleRequestToken} className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="이름"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            type="email"
            placeholder="이메일"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Button type="submit" className="w-full mt-2 py-3">
            본인 확인
          </Button>
        </form>
      ) : (
        <form onSubmit={handleConfirmReset} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Input
              type="password"
              placeholder="새 비밀번호"
              required
              className={
                !isLengthValid && formData.password.length > 0
                  ? 'border-status-error focus:ring-red-100'
                  : ''
              }
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <div
              className={`text-body ml-1 ${isLengthValid ? 'text-status-success' : 'text-gray-400'}`}
            >
              {isLengthValid ? '✓ 8자 이상 입력됨' : '• 8자 이상 입력해주세요'}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Input
              type="password"
              placeholder="새 비밀번호 확인"
              required
              className={
                !isMatchValid && formData.confirmPassword.length > 0
                  ? 'border-status-error focus:ring-red-100'
                  : ''
              }
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
            <div
              className={`text-body ml-1 ${isMatchValid ? 'text-status-success' : 'text-gray-400'}`}
            >
              {isMatchValid ? '✓ 비밀번호 일치' : '• 비밀번호가 일치하지 않습니다'}
            </div>
          </div>

          <Button
            type="submit"
            disabled={!isLengthValid || !isMatchValid}
            className="w-full mt-2 py-3"
          >
            비밀번호 변경 완료
          </Button>
        </form>
      )}

      <button
        onClick={onBackToLogin}
        className="mt-6 w-full text-center text-sm text-gray-400 hover:text-gray-600 hover:underline cursor-pointer"
      >
        로그인으로 돌아가기
      </button>
    </div>
  );
};

export default PasswordResetForm;
