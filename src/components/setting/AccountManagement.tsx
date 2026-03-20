import { useNavigate } from 'react-router-dom';
import { logoutApi, deleteAccountApi } from '@/api/Auth';
import { useAuthStore } from '@/store/useAuthStore';
import { PATH } from '@/router/Path';
import UserInfo from './UserInfo';
import UserAction from './UserAction';

const AccountManagement = () => {
  const navigate = useNavigate();
  const { userInfo, logout } = useAuthStore();

  const handleLogout = async () => {
    if (!window.confirm('로그아웃 하시겠습니까?')) return;
    try {
      await logoutApi();
      logout();
      alert('로그아웃 되었습니다.');
      navigate(PATH.POSTING);
    } catch (error) {
      console.error('로그아웃 실패:', error);
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('정말로 회원탈퇴를 진행하시겠습니까?\n탈퇴 시 모든 데이터가 삭제됩니다.'))
      return;
    try {
      await deleteAccountApi();
      logout();
      alert('회원탈퇴가 완료되었습니다.');
      navigate(PATH.POSTING);
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
      alert('인증 세션이 만료되었거나 권한이 없습니다. 다시 로그인 후 시도해주세요.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-[#e8eaf0] shadow-sm animate-[fadeUp_0.3s_ease]">
      <UserInfo name={userInfo?.name || ''} email={userInfo?.email || ''} />
      <UserAction onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} />
    </div>
  );
};

export default AccountManagement;
