import React from 'react';

interface RegisterProps {
  onSwitchLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchLogin }) => {
  return (
    <div>
      <h2 className="pg-title">회원가입 컴포넌트</h2>
      <button onClick={onSwitchLogin} className="text-indigo-600 underline">
        이미 계정이 있으신가요? 로그인
      </button>
    </div>
  );
};

export default Register;
