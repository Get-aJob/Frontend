import AccountManagement from '@/components/setting/AccountManagement';

function Settings() {
  return (
    /* ✨ Layout에서 p-8과 애니메이션을 담당하므로, 여기선 구조적 간격(gap)만 설정합니다. */
    <div className="flex flex-col gap-8">
      {/* 계정 관리 메인 컴포넌트 */}
      <div className="w-full">
        <AccountManagement />
      </div>
    </div>
  );
}

export default Settings;
