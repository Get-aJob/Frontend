import { NavLink } from 'react-router-dom';
import type { NavItemType } from './constants.ts';

interface SidebarNavItemProps {
  item: NavItemType;
}

const SidebarNavItem = ({ item }: SidebarNavItemProps) => {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-2.5 py-2.25 mb-px rounded-[9px] text-[13.5px] transition-all duration-150 cursor-pointer ${
          isActive
            ? 'bg-[#eef2ff] text-[#4f46e5] font-bold'
            : 'text-[#6b7280] font-medium hover:bg-gray-50'
        }`
      }
    >
      <span className="w-5 text-[16px] text-center shrink-0">{item.icon}</span>
      {item.label}

      {item.badge && (
        <span
          className={`ml-auto text-[10px] font-bold px-1.75 py-px rounded-full text-white ${item.badgeColor}`}
        >
          {item.badge}
        </span>
      )}
    </NavLink>
  );
};

export default SidebarNavItem;
