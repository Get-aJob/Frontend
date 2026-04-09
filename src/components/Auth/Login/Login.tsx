import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PATH } from '@/router/Path';
import LoginForm from './LoginForm';
import PasswordResetForm from './PasswordResetForm';
import { loginApi, googleCredentialLoginApi } from '@/api/Auth';
import type { LoginField } from '@/types/Auth';
import { useAuthStore } from '@/store/useAuthStore';

interface LoginProps {
  onSwitchRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchRegister }) => {
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login);
  const [mode, setMode] = useState<'login' | 'reset'>('login');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (data: LoginField) => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await loginApi(data);
      if (response && response.user) {
        loginAction({
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          profile_image_url: response.user.profile_image_url,
          provider: response.user.provider || 'local',
        });
        navigate(PATH.ROOT);
      }
    } catch (error: unknown) {
      let errorMessage = '로그인 중 오류가 발생했습니다.';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || errorMessage;
      }
      setErrorMsg(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credential?: string) => {
    if (!credential) {
      setErrorMsg('Google 로그인 응답이 올바르지 않습니다.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await googleCredentialLoginApi(credential);
      if (!response?.user?.name || !response?.user?.email) {
        setErrorMsg('사용자 정보를 불러올 수 없습니다.');
        return;
      }
      loginAction({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        profile_image_url: response.user.profile_image_url,
        provider: response.user.provider || 'google',
      });
      navigate(PATH.ROOT);
    } catch {
      setErrorMsg('Google 로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (mode === 'reset') {
    return <PasswordResetForm onBackToLogin={() => setMode('login')} />;
  }

  return (
    <div className="flex flex-col animate-[fadeUp_0.3s_ease]">
      <div className="mb-6 text-center">
        <h2 className="text-title font-bold text-gray-900">로그인</h2>
      </div>

      <LoginForm
        onSubmit={handleLogin}
        onGoogleLogin={handleGoogleLogin}
        onSwitchRegister={onSwitchRegister}
        onForgotPassword={() => setMode('reset')}
        isLoading={isLoading}
        errorMsg={errorMsg}
      />
    </div>
  );
};

export default Login;
