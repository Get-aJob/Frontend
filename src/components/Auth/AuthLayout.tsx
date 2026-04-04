import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="relative flex min-h-screen flex-col bg-bg-view text-gray-900">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -right-37.5 -top-150 h-150 w-150 rounded-full bg-btn-point opacity-5"></div>
        <div className="absolute -left-25 -bottom-25 h-100 w-100 rounded-full bg-btn-point opacity-10"></div>
      </div>

      <main className="relative z-10 flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-105 rounded-2xl border-[1.5px] border-border-light bg-white p-10 shadow-[0_20px_60px_rgba(0,0,0,0.1),0_8px_20px_rgba(0,0,0,0.06)]">
          <div className="mb-8 flex flex-col items-center justify-center gap-3">
            {' '}
            <div className="flex items-center gap-3">
              <img src="/GobMoa.png" alt="취업모아 로고" className="h-14 w-auto object-contain" />
              <div className="text-title font-black tracking-tight text-gray-950">취업모아</div>
            </div>
            <div className="text-body tracking-wide text-gray-400">취업 지원 관리 서비스</div>
          </div>
          <div className="animate-[fadeUp_0.2s_ease]">{children}</div>
        </div>
      </main>

      <footer className="relative z-10 p-4 text-center text-body text-gray-400">
        © 2026 <span className="font-semibold text-gray-500">취업모아(Job-Moa)</span> · 취업 지원
        관리 서비스
      </footer>
    </div>
  );
};

export default AuthLayout;
