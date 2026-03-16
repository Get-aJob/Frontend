import React from 'react';

interface RegisterFormProps {
  onSwitchLogin: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchLogin, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* 이름 입력 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-[#4b5563] ml-1">이름</label>
        <input
          type="text"
          placeholder="홍길동"
          className="w-full p-3 rounded-xl border border-[#e8eaf0] bg-[#f9fafb] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all"
          required
        />
      </div>

      {/* 이메일 입력 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-[#4b5563] ml-1">이메일</label>
        <input
          type="email"
          placeholder="example@email.com"
          className="w-full p-3 rounded-xl border border-[#e8eaf0] bg-[#f9fafb] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all"
          required
        />
      </div>

      {/* 비밀번호 입력 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-[#4b5563] ml-1">비밀번호</label>
        <input
          type="password"
          placeholder="8자 이상 입력해주세요"
          className="w-full p-3 rounded-xl border border-[#e8eaf0] bg-[#f9fafb] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all"
          required
        />
      </div>

      {/* 비밀번호 확인 */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-[#4b5563] ml-1">비밀번호 확인</label>
        <input
          type="password"
          placeholder="비밀번호를 한 번 더 입력해주세요"
          className="w-full p-3 rounded-xl border border-[#e8eaf0] bg-[#f9fafb] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all"
          required
        />
      </div>

      {/* 회원가입 버튼 */}
      <button
        type="submit"
        className="mt-2 w-full p-3.5 rounded-xl bg-linear-to-br from-[#4f46e5] to-[#8b5cf6] text-white text-[14px] font-bold shadow-[0_4px_12px_rgba(79,70,229,0.2)] hover:opacity-95 transition-opacity active:scale-[0.98] cursor-pointer"
      >
        회원가입 시작하기
      </button>

      {/* 로그인으로 돌아가기 */}
      <div className="mt-4 text-center text-[13px] text-[#9ca3af]">
        이미 계정이 있으신가요?
        <button
          type="button"
          onClick={onSwitchLogin}
          className="font-bold text-[#4f46e5] ml-1.5 hover:underline cursor-pointer"
        >
          로그인
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
