import React from 'react';
import { useForm } from 'react-hook-form';
import type { LoginField } from '@/types/Auth';

interface LoginFormProps {
  onSubmit: (data: LoginField) => void;
  onSwitchRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onSwitchRegister }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginField>({
    mode: 'onChange',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* 이메일 필드 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-[#4b5563] ml-1">이메일</label>
        <input
          type="email"
          placeholder="example@email.com"
          className={`w-full p-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-[#e8eaf0]'} bg-[#f9fafb] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all`}
          {...register('email', {
            required: '이메일을 입력해주세요.',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: '올바른 이메일 형식이 아닙니다.',
            },
          })}
        />
        {errors.email && (
          <span className="text-red-500 text-[11px] ml-1">{errors.email.message}</span>
        )}
      </div>

      {/* 비밀번호 필드 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-[#4b5563] ml-1">비밀번호</label>
        <input
          type="password"
          placeholder="••••••••"
          className={`w-full p-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-[#e8eaf0]'} bg-[#f9fafb] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all`}
          {...register('password', {
            required: '비밀번호를 입력해주세요.',
            minLength: { value: 8, message: '비밀번호는 8자 이상이어야 합니다.' },
          })}
        />
        {errors.password && (
          <span className="text-red-500 text-[11px] ml-1">{errors.password.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="mt-2 w-full p-3.5 rounded-xl bg-linear-to-br from-[#4f46e5] to-[#8b5cf6] text-white text-[14px] font-bold shadow-[0_4px_12px_rgba(79,70,229,0.2)] hover:opacity-95 transition-opacity active:scale-[0.98] cursor-pointer"
      >
        로그인
      </button>

      <div className="mt-4 flex flex-col items-center gap-4">
        <div className="text-[13px] text-[#9ca3af]">
          아직 계정이 없으신가요?
          <button
            type="button"
            onClick={onSwitchRegister}
            className="font-bold text-[#4f46e5] ml-1.5 hover:underline cursor-pointer"
          >
            회원가입
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
