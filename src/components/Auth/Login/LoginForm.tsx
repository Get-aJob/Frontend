import React from 'react';
import { useForm } from 'react-hook-form';
import type { LoginField } from '@/types/Auth';

interface LoginFormProps {
  onSubmit: (data: LoginField) => void;
  onSwitchRegister: () => void;
  onForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onSwitchRegister, onForgotPassword }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginField>({
    mode: 'onChange',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* 이메일 입력 섹션 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-[#374151] ml-1">이메일</label>
        <input
          type="email"
          placeholder="example@email.com"
          className={`w-full p-3.5 rounded-xl border ${errors.email ? 'border-red-500' : 'border-[#e8eaf0]'} bg-[#f9fafb] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/10 focus:border-[#4f46e5] transition-all`}
          {...register('email', { required: '이메일을 입력해주세요.' })}
        />
        {errors.email && (
          <span className="text-red-500 text-[11px] ml-1">{errors.email.message}</span>
        )}
      </div>

      {/* 비밀번호 입력 섹션: 라벨과 재설정 링크를 한 줄에 배치 */}
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
          className={`w-full p-3.5 rounded-xl border ${errors.password ? 'border-red-500' : 'border-[#e8eaf0]'} bg-[#f9fafb] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/10 focus:border-[#4f46e5] transition-all`}
          {...register('password', { required: '비밀번호를 입력해주세요.' })}
        />
        {errors.password && (
          <span className="text-red-500 text-[11px] ml-1">{errors.password.message}</span>
        )}
      </div>

      {/* 로그인 버튼 */}
      <button
        type="submit"
        className="mt-2 w-full p-4 rounded-xl bg-linear-to-br from-[#4f46e5] to-[#8b5cf6] text-white text-[15px] font-bold shadow-[0_4px_15px_rgba(79,70,229,0.25)] hover:opacity-95 transition-all active:scale-[0.98] cursor-pointer"
      >
        로그인
      </button>

      {/* 하단 구분선 및 회원가입 안내 */}
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
