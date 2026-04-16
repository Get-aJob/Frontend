import AuthLayout from '@/components/Auth/AuthLayout';
import Login from '@/components/Auth/Login/Login';
import Register from '@/components/Auth/Register/Register';
import { useNavigate } from 'react-router-dom';
import { PATH } from '@/router/Path';

type AuthMode = 'LOGIN' | 'REGISTER';

interface AuthProps {
  mode: AuthMode;
}
const Auth = ({ mode }: AuthProps) => {
  const navigate = useNavigate();

  const goToRegister = () => {
    navigate(PATH.SIGN_IN);
  };
  const goToLogin = () => {
    navigate(PATH.AUTH);
  };

  return (
    <AuthLayout>
      {mode === 'LOGIN' && <Login onSwitchRegister={goToRegister} />}

      {mode === 'REGISTER' && <Register onSwitchLogin={goToLogin} />}
    </AuthLayout>
  );
};

export default Auth;
