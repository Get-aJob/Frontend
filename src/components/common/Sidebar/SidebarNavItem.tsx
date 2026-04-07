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
        `flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
          isActive
            ? 'bg-purple-50 text-btn-point font-bold'
            : 'text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-900'
        }`
      }
    >
      <span className="w-5 flex justify-center shrink-0">{item.icon}</span>
      {item.label}

      {item.badge && (
        <Badge variant={item.badgeVariant || 'default'} className="ml-auto">
          {item.badge}
        </Badge>
      )}
    </NavLink>
  );
};

export default SidebarNavItem;
