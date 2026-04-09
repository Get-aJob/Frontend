import { useNavigate } from 'react-router-dom';
import { PATH } from '@/router/Path';
import Button from '@/components/common/UI/Button';

interface ToastProps {
  visible: boolean;
  message: string;
  showLoginButton?: boolean;
}

const Toast = ({ visible, message, showLoginButton = false }: ToastProps) => {
  const navigate = useNavigate();

  if (!visible) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-2000 flex items-center gap-3 px-5 py-3 bg-purple-100 text-purple-900 text-sm font-medium rounded-2xl shadow-md animate-[fadeInDown_0.25s_ease]">
      <span>
        {showLoginButton ? '🔒' : '🔔'} {message}
      </span>
      {showLoginButton && (
        <Button size="sm" onClick={() => navigate(PATH.AUTH)}>
          로그인
        </Button>
      )}
    </div>
  );
};

export default Toast;
