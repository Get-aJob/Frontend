import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import type { LoginField } from '@/types/Auth';
import { googleCredentialLoginApi } from '@/api/Auth';
import { useAuthStore } from '@/store/useAuthStore';
import { PATH } from '@/router/Path';

interface LoginFormProps {
  onSubmit: (data: LoginField) => void;
  onSwitchRegister: () => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onSwitchRegister, onForgotPassword }) => {
  const navigate = useNavigate();
  const loginAction = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginField>({
    mode: 'onChange',
  });

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    try {
      if (!credentialResponse.credential) {
        alert('Google 로그인에 실패했습니다.');
        return;
      }
      const response = await googleCredentialLoginApi(credentialResponse.credential);
      if (response?.user) {
        loginAction({
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          profile_image_url: response.user.profile_image_url,
        });
        navigate(PATH.ROOT);
      }
    } catch (error) {
      console.error('Google 로그인 실패:', error);
      alert('Google 로그인에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleGoogleError = () => {
    alert('Google 로그인에 실패했습니다. 다시 시도해주세요.');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-85 mx-auto">
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-[#374151] ml-1">이메일</label>
        <input
          type="email"
          placeholder="example@email.com"
          className={`w-full p-3 rounded-md border ${errors.email ? 'border-red-500' : 'border-[#e8eaf0]'} bg-[#f9fafb] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/10 focus:border-[#4f46e5] transition-all`}
          {...register('email', { required: '이메일을 입력해주세요.' })}
        />
        {errors.email && (
          <span className="text-red-500 text-[11px] ml-1">{errors.email.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center px-1">
          <label className="text-[13px] font-semibold text-[#374151]">비밀번호</label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-[12px] font-medium text-[#6366f1] hover:text-[#4f46e5] transition-colors cursor-pointer"
          >
            비밀번호를 잊으셨나요?
          </button>
        </div>
        <input
          type="password"
          placeholder="비밀번호를 입력해주세요"
          className={`w-full p-3 rounded-md border ${errors.password ? 'border-red-500' : 'border-[#e8eaf0]'} bg-[#f9fafb] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/10 focus:border-[#4f46e5] transition-all`}
          {...register('password', { required: '비밀번호를 입력해주세요.' })}
        />
        {errors.password && (
          <span className="text-red-500 text-[11px] ml-1">{errors.password.message}</span>
        )}
      </div>
      <div className="flex flex-col gap-3 mt-2">
        <button
          type="submit"
          className="w-full h-10 flex justify-center items-center rounded-sm bg-[#4f46e5] hover:bg-[#4338ca] active:bg-[#3730a3] text-white text-[14px] font-medium shadow-sm transition-colors cursor-pointer"
        >
          로그인
        </button>

        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="continue_with"
            shape="rectangular"
            logo_alignment="center"
            width="340"
          />
        </div>
      </div>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#f3f4f6]"></div>
        </div>
        <div className="relative flex justify-center text-[12px]">
          <span className="px-2 bg-white text-[#9ca3af]">또는</span>
        </div>
      </div>

      <div className="text-center text-[13px] text-[#6b7280]">
        계정이 없으신가요?
        <button
          type="button"
          onClick={onSwitchRegister}
          className="font-bold text-[#4f46e5] ml-2 hover:underline cursor-pointer"
        >
          지금 가입하기
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
