import SidebarLogo from './SidebarLogo';
import SidebarNavItem from './SidebarNavItem';
import SidebarAuth from './SidebarAuth';
import { NAV_SECTIONS } from './constants';

const Sidebar = () => {
  return (
    <aside className="flex flex-col shrink-0 w-60 h-screen bg-white border-r border-border-light shadow-sm z-20">
      <SidebarLogo />

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx} className="mb-6 last:mb-0">
            <div className="px-3 mb-2 text-[10px] font-bold text-gray-400 tracking-wider uppercase">
              {section.title}
            </div>

            {section.items.map((item) => (
              <SidebarNavItem key={item.id} item={item} />
            ))}
          </div>
        ))}
      </nav>

      <SidebarAuth />
    </aside>
  );
};

export default Sidebar;
