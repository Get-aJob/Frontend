import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH } from '@/router/Path';
import LoginForm from './LoginForm';

interface LoginProps {
  onSwitchRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchRegister }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'test@test.com' && password === '1234') {
      alert('로그인 성공!');
      navigate(PATH.CALENDAR);
    } else {
      alert('이메일(test@test.com) 또는 비밀번호(1234)를 확인해주세요.');
    }
  };

  return (
    <div className="flex flex-col animate-[fadeUp_0.3s_ease]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#111827]">로그인</h2>
      </div>

      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
        onSwitchRegister={onSwitchRegister}
      />
    </div>
  );
};

export default Login;
