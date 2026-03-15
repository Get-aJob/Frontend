import SidebarLogo from './SidebarLogo';
import SidebarNavItem from './SidebarNavItem';
import SidebarAuth from './SidebarAuth';
import { NAV_SECTIONS } from './constants';

const Sidebar = () => {
  const isLoggedIn = false;

  return (
    <aside className="flex flex-col shrink-0 w-57.5 h-screen bg-white border-r border-[#e8eaf0] shadow-[2px_0_8px_rgba(0,0,0,0.03)] z-20">
      <SidebarLogo />

      <nav className="flex-1 px-2.5 py-3 overflow-y-auto">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className="mb-4.5 last:mb-0">
            <div className="px-2.5 mb-1.5 text-[9.5px] font-bold text-[#9ca3af] tracking-[1.5px] uppercase">
              {section.title}
            </div>

            {section.items.map((item) => (
              <SidebarNavItem key={item.id} item={item} />
            ))}
          </div>
        ))}
      </nav>

      <SidebarAuth isLoggedIn={isLoggedIn} />
    </aside>
  );
};

export default Sidebar;
