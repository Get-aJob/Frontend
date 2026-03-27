import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PATH } from '@/router/Path';
import LoginForm from './LoginForm';
import PasswordResetForm from './PasswordResetForm';
import { loginApi } from '@/api/Auth';
import type { LoginField } from '@/types/Auth';
import { useAuthStore } from '@/store/useAuthStore';

interface LoginProps {
  onSwitchRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchRegister }) => {
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login);

  const [mode, setMode] = useState<'login' | 'reset'>('login');

  const handleLogin = async (data: LoginField) => {
    try {
      const response = await loginApi(data);
      if (response && response.user) {
        loginAction({
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          profile_image_url: response.user.profile_image_url,
        });
        alert('로그인 성공!');
        navigate(PATH.ROOT);
      }
    } catch (error: unknown) {
      let errorMessage = '로그인 중 오류가 발생했습니다.';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || errorMessage;
      }
      alert(errorMessage);
    }
  };

  if (mode === 'reset') {
    return <PasswordResetForm onBackToLogin={() => setMode('login')} />;
  }

  return (
    <div className="flex flex-col animate-[fadeUp_0.3s_ease]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#111827]">로그인</h2>
        <p className="text-sm text-[#9ca3af] mt-1">Job-Moa 서비스 이용을 위해 로그인해주세요.</p>
      </div>

      <LoginForm
        onSubmit={handleLogin}
        onSwitchRegister={onSwitchRegister}
        onForgotPassword={() => setMode('reset')}
      />
    </div>
  );
};

export default Login;
