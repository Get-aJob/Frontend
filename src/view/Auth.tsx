import React, { useState } from 'react';
import AuthLayout from '@/components/Auth/AuthLayout';
import Login from '@/components/Auth/Login/Login';
import Register from '@/components/Auth/Register/Register';

type AuthMode = 'LOGIN' | 'REGISTER';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('LOGIN');

  const goToRegister = () => setMode('REGISTER');
  const goToLogin = () => setMode('LOGIN');

  return (
    <AuthLayout>
      {mode === 'LOGIN' && <Login onSwitchRegister={goToRegister} />}

      {mode === 'REGISTER' && <Register onSwitchLogin={goToLogin} />}
    </AuthLayout>
  );
};

export default Auth;
