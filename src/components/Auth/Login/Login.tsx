import React from 'react';

interface LoginProps {
  onSwitchRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchRegister }) => {
  return (
    <div>
      <h2 className="pg-title">로그인 컴포넌트</h2>
      <button onClick={onSwitchRegister} className="text-indigo-600 underline block mb-2">
        회원가입으로 이동
      </button>
      <button className="text-gray-500 text-sm underline">비밀번호를 잊으셨나요?</button>
    </div>
  );
};

export default Login;
