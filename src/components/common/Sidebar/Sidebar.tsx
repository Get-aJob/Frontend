import { useEffect, useMemo, useRef, useState } from 'react';
import SidebarLogo from './SidebarLogo';
import SidebarNavItem from './SidebarNavItem';
import SidebarAuth from './SidebarAuth';
import { NAV_SECTIONS } from './constants';
import type { NavSectionType, NavItemType } from './constants';
import { useNotificationStore } from '@/store/useNotificationStore';
import clsx from 'clsx';
import { useMobilesidebarStore } from '@/store/useMobileSidebarStore';
import { useLocation } from 'react-router-dom';

const Sidebar = () => {
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const sidebarRef = useRef<HTMLElement | null>(null);
  const location = useLocation();

  const isOpen = useMobilesidebarStore((state) => state.isOpen);
  const toggle = useMobilesidebarStore((state) => state.toggle);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 1024px)').matches);
  const prevPathname = useRef(location.pathname);

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

  useEffect(() => {
    if (prevPathname.current !== location.pathname) {
      prevPathname.current = location.pathname;
      if (isMobile && isOpen) toggle();
    }
  }, [isMobile, isOpen, location.pathname, toggle]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (sidebarRef && !sidebarRef.current?.contains(e.target as Node) && isOpen) {
        toggle();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, toggle]);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1024px)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className={clsx(
        'flex flex-col w-64 h-full bg-white border-r border-border-light shrink-0 z-40 transition-all max-lg:fixed max-lg:shadow-lg',
        isOpen || !isMobile ? '' : '-translate-x-full',
      )}
    >
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
