import { Link } from 'react-router-dom';

interface NavItemProps {
  id: string;
  icon: string;
  label: string;
  badge?: number;
  badgeColor?: string;
  path: string;
  onClick?: () => void;
}

const NavItem = ({ icon, label, badge, badgeColor, onClick, path }: NavItemProps) => {
  return (
    <Link to={path}>
      <div
        onClick={onClick}
        className="group flex items-center gap-2.25 px-2.5 py-2.25 rounded-[9px] text-[13.5px] font-medium text-gray-500 cursor-pointer transition-all hover:bg-gray-100 hover:text-indigo-600"
      >
        <span className="text-[16px] w-5 text-center shrink-0">{icon}</span>
        {label}
        {badge !== undefined && (
          <span
            className={`ml-auto text-[10px] font-bold px-1.75 py-px rounded-full text-white ${badgeColor || 'bg-indigo-600'}`}
          >
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
};

export default NavItem;
