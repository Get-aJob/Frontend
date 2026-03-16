import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="relative flex min-h-screen flex-col bg-[#f4f5f8] font-['Noto_Sans_KR'] text-[#111827]">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -right-37.5 -top-150 h-150 w-150 rounded-full bg-[#4f46e5] opacity-5"></div>
        <div className="absolute -left-25 -bottom-25 h-100 w-100 rounded-full bg-[#8b5cf6] opacity-5"></div>
      </div>

      <main className="relative z-10 flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-105 rounded-[20px] border-[1.5px] border-[#e8eaf0] bg-white p-10 shadow-[0_20px_60px_rgba(0,0,0,0.1),0_8px_20px_rgba(0,0,0,0.06)]">
          <div className="mb-8 flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-linear-to-br from-[#4f46e5] to-[#8b5cf6] font-['DM_Mono'] text-[16px] font-black text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)]">
                JOB
              </div>
              <div className="text-[20px] font-black tracking-tight">Job-Moa</div>
            </div>
            <div className="text-[10px] tracking-[0.5px] text-[#9ca3af]">취업 지원 관리 서비스</div>
          </div>
          <div className="animate-[fadeUp_0.2s_ease]">{children}</div>
        </div>
      </main>

      <footer className="relative z-10 p-4 text-center text-[11.5px] text-[#9ca3af]">
        © 2026 <span className="font-semibold text-[#6b7280]">Job-Moa</span> · 취업 지원 관리 서비스
      </footer>
    </div>
  );
};

export default AuthLayout;
