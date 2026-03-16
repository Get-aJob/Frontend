import { useState } from 'react';
import NavItem from './NavItem';

const Sidebar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  return (
    <aside className="w-57.5 h-screen bg-white border-r border-[#e8eaf0] flex flex-col shrink-0 shadow-[2px_0_8px_rgba(0,0,0,0.03)]">
      {/* Logo Section */}
      <div className="p-[20px_18px_16px] border-b border-[#e8eaf0]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-[10px] bg-linear-to-br from-[#4f46e5] to-[#8b5cf6] flex items-center justify-center text-[17px] font-black text-white font-mono shadow-[0_4px_14px_rgba(79,70,229,0.25)]">
            JT
          </div>
          <div>
            <div className="text-[17px] font-extrabold text-[#111827] tracking-tight">Job-Moa</div>
            <div className="text-[10px] text-[#9ca3af] mt-0.5">취업 지원 관리</div>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 p-[12px_10px] overflow-y-auto custom-scrollbar">
        {/* Main Section */}
        <div className="mb-4.5">
          <div className="text-[9.5px] font-bold text-[#9ca3af] tracking-[1.5px] uppercase px-2.5 mb-1.25">
            메인
          </div>
          <NavItem id="nav-calendar" icon="📅" label="캘린더" path="/" />
          <NavItem id="nav-kanban" icon="📋" label="지원 현황" badge={12} path="" />
          <NavItem id="nav-jobboard" icon="🔍" label="전체 공고" path="" />
          <NavItem id="nav-stats" icon="📊" label="통계 분석" path="" />
        </div>

        {/* Management Section */}
        <div className="mb-4.5">
          <div className="text-[9.5px] font-bold text-[#9ca3af] tracking-[1.5px] uppercase px-2.5 mb-1.25">
            관리
          </div>
          <NavItem id="nav-resume" icon="🗂️" label="이력서 관리" path="/resume" />
          <NavItem
            id="nav-scrap"
            icon="🔖"
            label="공고 스크랩"
            badge={5}
            badgeColor="bg-amber-500"
            path=""
          />
        </div>

        {/* Others Section */}
        <div>
          <div className="text-[9.5px] font-bold text-[#9ca3af] tracking-[1.5px] uppercase px-2.5 mb-1.25">
            기타
          </div>
          <NavItem
            id="nav-noti"
            icon="🔔"
            label="알림"
            badge={3}
            badgeColor="bg-rose-500"
            path=""
          />
          <NavItem id="nav-settings" icon="⚙️" label="계정 설정" path="" />
        </div>
      </nav>

      {/* Bottom Auth Section */}
      <div className="border-t border-[#e8eaf0] p-4">
        {!isLoggedIn ? (
          <button
            onClick={() => setIsLoggedIn(true)}
            className="w-full p-2.5 rounded-[10px] bg-linear-to-br from-[#4f46e5] to-[#8b5cf6] text-white text-[13px] font-bold flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(79,70,229,0.2)] hover:opacity-90 transition-opacity"
          >
            <span>🔐</span> 로그인 / 시작하기
          </button>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-full bg-[#6366f1] flex items-center justify-center text-[13px] font-extrabold text-white shrink-0">
              김
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-[13px] font-bold text-[#111827] truncate">김개발</div>
              <div className="text-[11px] text-[#9ca3af] truncate">프론트엔드 지망</div>
            </div>
            <span className="text-[#9ca3af] cursor-pointer text-[16px] p-1 hover:text-gray-600 transition-colors">
              ⚙
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
