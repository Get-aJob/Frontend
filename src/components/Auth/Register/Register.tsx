import React from 'react';
import RegisterForm from './RegisterForm';

interface RegisterProps {
  onSwitchLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchLogin }) => {
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert('회원가입 기능은 현재 준비 중입니다! 폼 구조를 확인해 보세요.');
  };

  return (
    <div className="flex flex-col animate-[fadeUp_0.3s_ease]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#111827]">회원가입</h2>
        <p className="text-sm text-[#9ca3af] mt-1">Job-Moa와 함께 취업 준비를 시작해 보세요.</p>
      </div>

      <RegisterForm onSwitchLogin={onSwitchLogin} onSubmit={handleRegister} />
    </div>
  );
};

export default Register;
