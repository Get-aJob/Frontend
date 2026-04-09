import { useMemo } from 'react';
import SidebarLogo from './SidebarLogo';
import SidebarNavItem from './SidebarNavItem';
import SidebarAuth from './SidebarAuth';
import { NAV_SECTIONS } from './constants';
import type { NavSectionType, NavItemType } from './constants';
import { useNotificationStore } from '@/store/useNotificationStore';

const Sidebar = () => {
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const navSections = useMemo<NavSectionType[]>(() => {
    return NAV_SECTIONS.map((section) => ({
      ...section,
      items: section.items.map((item) =>
        item.id === 'nav-noti'
          ? {
            ...item,
            badge: unreadCount > 0 ? unreadCount : undefined,
          }
          : item,
      ),
    }));
  }, [unreadCount]);

  return (
    <aside className="flex flex-col w-64 h-full bg-white border-r border-border-light shrink-0 z-40 transition-all">
      <SidebarLogo />

      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
        {navSections.map((section: NavSectionType) => (
          <div key={section.title} className="space-y-2">
            <h3 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item: NavItemType) => (
                <SidebarNavItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
        {/* {NAV_SECTIONS.map((section: NavSectionType) => (
          <div key={section.title} className="space-y-2">
            <h3 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              {section.title}
            </h3>

            <div className="space-y-1">
              {section.items.map((item: NavItemType) => (
                <SidebarNavItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))} */}
      </nav>

      <SidebarAuth />
    </aside>
  );
};

export default Sidebar;
