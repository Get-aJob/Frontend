import React from 'react';
import { useForm } from 'react-hook-form';
import { GoogleLogin } from '@react-oauth/google'; // ✨ 다시 공식 컴포넌트 사용
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
  } = useForm<LoginField>({ mode: 'onChange' });

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
            className="text-body font-medium text-btn-point cursor-pointer"
          >
            비밀번호를 잊으셨나요?
          </button>
        </div>
        <Input
          type="password"
          placeholder="비밀번호를 입력해주세요"
          disabled={isLoading}
          {...register('password', { required: '비밀번호를 입력해주세요.' })}
        />
        {errors.password && (
          <span className="text-status-error text-body ml-1">{errors.password.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-3 mt-4">
        {/* ✨ 핵심: 일반 로그인 버튼의 높이를 구글 버튼(large)의 기본 높이인 40px(h-10)에 정확히 맞춤 */}
        <Button type="submit" className="w-full h-10" isLoading={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </Button>

        {/* ✨ 구글 공식 버튼 복구 (백엔드 정상 작동) */}
        <div className="w-full flex justify-center [&>div]:w-full">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              onGoogleLogin(credentialResponse.credential);
            }}
            onError={() => onGoogleLogin(undefined)}
            size="large" // large 사이즈는 높이가 딱 40px 입니다.
            text="signin_with"
            shape="rectangular"
            width="100%"
          />
        </div>
      </div>

      <div className="relative my-4">
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
          className="font-bold text-btn-point ml-2 cursor-pointer"
        >
          지금 가입하기
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
