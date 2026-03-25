import { useNavigate } from 'react-router-dom';
import { PATH } from '@/router/Path';

interface LoginToastProps {
  visible: boolean;
  message?: string;
}

const LoginToast = ({
  visible,
  message = '공고 등록은 로그인 후 이용할 수 있어요.',
}: LoginToastProps) => {
  const navigate = useNavigate();

  if (!visible) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-2000 flex items-center gap-3 px-5 py-3 bg-[#ede9fe] text-[#5b21b6] text-[13px] font-medium rounded-xl shadow-[0_4px_16px_rgba(139,92,246,0.2)] animate-[fadeInDown_0.25s_ease]">
      <span>🔒 {message}</span>
      <button
        onClick={() => navigate(PATH.AUTH)}
        className="ml-1 px-3 py-1 text-[12px] font-bold text-white bg-[#7c3aed] rounded-[7px] hover:bg-[#6d28d9] transition-colors"
      >
        로그인
      </button>
    </div>
  );
};

export default LoginToast;
