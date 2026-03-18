import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PATH } from '@/router/Path';
import LoginForm from './LoginForm';
import { loginApi } from '@/api/Auth';
import type { LoginField } from '@/types/Auth';

interface LoginProps {
  onSwitchRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchRegister }) => {
  const navigate = useNavigate();

  const handleLogin = async (data: LoginField) => {
    try {
      const response = await loginApi(data);

      alert('로그인 성공!');
      console.log('로그인 응답 데이터:', response);

      navigate(PATH.CALENDAR);
    } catch (error: unknown) {
      let errorMessage = '로그인 중 오류가 발생했습니다.';

      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || errorMessage;
      }

      alert(errorMessage);
      console.error('로그인 에러 상세:', error);
    }
  };

  return (
    <div className="flex flex-col animate-[fadeUp_0.3s_ease]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#111827]">로그인</h2>
        <p className="text-sm text-[#9ca3af] mt-1">Job-Moa 서비스 이용을 위해 로그인해주세요.</p>
      </div>

      <LoginForm onSubmit={handleLogin} onSwitchRegister={onSwitchRegister} />
    </div>
  );
};

export default Login;
