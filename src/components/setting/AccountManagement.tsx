import { useNavigate } from 'react-router-dom';
import {
  logoutApi,
  deleteAccountApi,
  uploadProfileImageApi,
  deleteProfileImageApi,
  requestPasswordResetApi,
  confirmPasswordResetApi,
} from '@/api/Auth';
import { useAuthStore } from '@/store/useAuthStore';
import { PATH } from '@/router/Path';
import UserInfo from './UserInfo';
import UserAction from './UserAction';

const AccountManagement = () => {
  const navigate = useNavigate();
  const { userInfo, logout, login } = useAuthStore();

  const handleUploadImage = async (file: File) => {
    try {
      const res = await uploadProfileImageApi(file);
      if (userInfo) {
        login({
          ...userInfo,
          profile_image_url: res.profileImageUrl,
        });
        alert('프로필 이미지가 변경되었습니다.');
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  const handleDeleteImage = async () => {
    if (!window.confirm('프로필 이미지를 삭제하시겠습니까?')) return;
    try {
      await deleteProfileImageApi();
      if (userInfo) {
        login({
          ...userInfo,
          profile_image_url: null,
        });
        alert('프로필 이미지가 삭제되었습니다.');
      }
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      alert('이미지 삭제에 실패했습니다.');
    }
  };

  const handlePasswordResetFlow = async (newPassword: string) => {
    if (!userInfo?.email || !userInfo?.name) {
      alert('사용자 정보가 확인되지 않습니다.');
      return;
    }

    try {
      const { reset_token } = await requestPasswordResetApi({
        email: userInfo.email,
        name: userInfo.name,
      });

      await confirmPasswordResetApi({
        reset_token,
        password: newPassword,
      });

      alert('비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.');
      await logoutApi();
      logout();
      navigate(PATH.AUTH);
    } catch (error) {
      console.error('비밀번호 재설정 실패:', error);
      alert('비밀번호 재설정 중 오류가 발생했습니다. 현재 비밀번호 등을 다시 확인해주세요.');
    }
  };

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
    if (!window.confirm('정말로 회원탈퇴를 진행하시겠습니까?')) return;
    try {
      await deleteAccountApi();
      logout();
      alert('회원탈퇴가 완료되었습니다.');
      navigate(PATH.POSTING);
    } catch (error) {
      console.error('회원탈퇴 실패:', error);
      alert('회원탈퇴 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-[#e8eaf0] shadow-sm animate-[fadeUp_0.3s_ease]">
      <UserInfo
        name={userInfo?.name || ''}
        email={userInfo?.email || ''}
        profileImageUrl={userInfo?.profile_image_url}
        onUploadImage={handleUploadImage}
        onDeleteImage={handleDeleteImage}
      />
      <UserAction
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
        onRequestPasswordReset={handlePasswordResetFlow}
      />
    </div>
  );
};

export default AccountManagement;
