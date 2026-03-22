import AccountManagement from '@/components/setting/AccountManagement';

function Settings() {
  return (
    <div className="p-8 animate-[fadeUp_0.3s_ease]">
      <h1 className="text-2xl font-bold text-[#111827] mb-6">계정 설정</h1>

      <AccountManagement />
    </div>
  );
}

export default Settings;
