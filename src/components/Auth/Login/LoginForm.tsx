import React from 'react';

interface LoginFormProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchRegister: () => void; // 회원가입 전환을 위해 추가
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
  onSwitchRegister,
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-[#4b5563] ml-1">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          className="w-full p-3 rounded-xl border border-[#e8eaf0] bg-[#f9fafb] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-[#4b5563] ml-1">비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full p-3 rounded-xl border border-[#e8eaf0] bg-[#f9fafb] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all"
          required
        />
      </div>

      <button
        type="submit"
        className="mt-2 w-full p-3.5 rounded-xl bg-linear-to-br from-[#4f46e5] to-[#8b5cf6] text-white text-[14px] font-bold shadow-[0_4px_12px_rgba(79,70,229,0.2)] hover:opacity-95 transition-opacity active:scale-[0.98] cursor-pointer"
      >
        로그인
      </button>

      <div className="mt-4 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 text-[12px] text-[#9ca3af]">
          <button type="button" className="hover:text-[#6366f1] transition-colors cursor-pointer">
            비밀번호 찾기
          </button>
        </div>

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
