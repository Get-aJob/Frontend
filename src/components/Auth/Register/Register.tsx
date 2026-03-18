import React from 'react';
import axios from 'axios';
import RegisterForm from './RegisterForm';
import { joinApi } from '@/api/Auth';
import type { JoinField } from '@/types/Auth';

interface RegisterProps {
  onSwitchLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchLogin }) => {
  const handleRegister = async (data: JoinField) => {
    try {
      const response = await joinApi(data);

      alert(response.message || '회원가입에 성공했습니다.');

      onSwitchLogin();
    } catch (error: unknown) {
      let errorMessage = '회원가입 중 오류가 발생했습니다.';

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || errorMessage;
      }

      alert(errorMessage);
      console.error('회원가입 에러 상세:', error);
    }
  };

  return (
    <div className="flex flex-col animate-[fadeUp_0.3s_ease]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#111827]">회원가입</h2>
        <p className="text-sm text-[#9ca3af] mt-1">Job-Moa와 함께 취업 준비를 시작해 보세요.</p>
      </div>

      <RegisterForm onSwitchLogin={onSwitchLogin} onSubmit={handleRegister} />
    </div>
  );
};

export default Register;
