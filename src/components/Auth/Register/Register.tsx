import React, { useState } from 'react';
import axios from 'axios';
import RegisterForm from './RegisterForm';
import { joinApi } from '@/api/Auth';
import type { JoinField } from '@/types/Auth';

interface RegisterProps {
  onSwitchLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (data: JoinField) => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      await joinApi(data);
      window.alert('회원가입이 완료되었습니다!');
      onSwitchLogin();
    } catch (error: unknown) {
      let errorMessage = '회원가입 중 오류가 발생했습니다.';

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || errorMessage;
      }

      setErrorMsg(errorMessage);
      console.error('회원가입 실패', {
        status: axios.isAxiosError(error) ? error.response?.status : undefined,
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col animate-[fadeUp_0.3s_ease]">
      <div className="mb-6 text-center">
        <h2 className="text-title font-bold text-gray-900">회원가입</h2>
      </div>

      <RegisterForm
        onSwitchLogin={onSwitchLogin}
        onSubmit={handleRegister}
        isLoading={isLoading}
        errorMsg={errorMsg}
      />
    </div>
  );
};

export default Register;
