import { NavLink } from 'react-router-dom';
import type { NavItemType } from './constants';
import Badge from '@/components/common/UI/Badge';

interface SidebarNavItemProps {
  item: NavItemType;
}

const SidebarNavItem = ({ item }: SidebarNavItemProps) => {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        // ✨ 패딩, 글씨 크기, 내부 SVG 아이콘 크기 축소
        `flex items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-2 sm:py-2.5 mb-1 rounded-lg text-[12px] sm:text-sm transition-all duration-150 cursor-pointer [&>span>svg]:w-4 [&>span>svg]:h-4 sm:[&>span>svg]:w-5 sm:[&>span>svg]:h-5 ${
          isActive
            ? 'bg-purple-50 text-btn-point font-bold'
            : 'text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-900'
        }`
      }
    >
      <span className="w-4 sm:w-5 flex justify-center shrink-0">{item.icon}</span>
      {item.label}

      {item.badge && (
        <Badge
          variant={item.badgeVariant || 'default'}
          className="ml-auto px-1.5 sm:px-2 py-0 sm:py-0.5 text-[9px] sm:text-[10px]"
        >
          {item.badge}
        </Badge>
      )}
    </NavLink>
  );
};

export default SidebarNavItem;
