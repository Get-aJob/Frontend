import React from 'react';
import { useForm } from 'react-hook-form';
import { GoogleLogin } from '@react-oauth/google';
import type { LoginField } from '@/types/Auth';
import Input from '@/components/common/UI/Input';
import Button from '@/components/common/UI/Button';

interface LoginFormProps {
  onSubmit: (data: LoginField) => void;
  onGoogleLogin: (credential?: string) => void;
  onSwitchRegister: () => void;
  onForgotPassword: () => void;
  isLoading: boolean;
  errorMsg: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onGoogleLogin,
  onSwitchRegister,
  onForgotPassword,
  isLoading,
  errorMsg,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginField>({
    mode: 'onChange',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-85 mx-auto">
      {errorMsg && (
        <div className="p-3 mb-2 rounded-lg bg-red-50 text-status-error text-sm font-bold text-center border border-red-100">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700 ml-1">이메일</label>
        <Input
          type="email"
          placeholder="example@email.com"
          disabled={isLoading}
          className={errors.email ? 'border-status-error focus:ring-red-100' : ''}
          {...register('email', { required: '이메일을 입력해주세요.' })}
        />
        {errors.email && (
          <span className="text-status-error text-body ml-1">{errors.email.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center px-1">
          <label className="text-sm font-semibold text-gray-700">비밀번호</label>
          <button
            type="button"
            onClick={onForgotPassword}
            disabled={isLoading}
            className="text-body font-medium text-btn-point hover:text-purple-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            비밀번호를 잊으셨나요?
          </button>
        </div>
        <Input
          type="password"
          placeholder="비밀번호를 입력해주세요"
          disabled={isLoading}
          className={errors.password ? 'border-status-error focus:ring-red-100' : ''}
          {...register('password', { required: '비밀번호를 입력해주세요.' })}
        />
        {errors.password && (
          <span className="text-status-error text-body ml-1">{errors.password.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <Button type="submit" className="w-full py-2.5" isLoading={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </Button>

        <div
          className={`flex justify-center w-full transition-opacity ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <GoogleLogin
            onSuccess={(res) => onGoogleLogin(res.credential)}
            onError={() => onGoogleLogin(undefined)}
            text="continue_with"
            shape="rectangular"
            logo_alignment="center"
            width="340"
          />
        </div>
      </div>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-light"></div>
        </div>
        <div className="relative flex justify-center text-body">
          <span className="px-2 bg-white text-gray-400">또는</span>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        계정이 없으신가요?
        <button
          type="button"
          onClick={onSwitchRegister}
          disabled={isLoading}
          className="font-bold text-btn-point ml-2 hover:underline cursor-pointer disabled:opacity-50"
        >
          지금 가입하기
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
