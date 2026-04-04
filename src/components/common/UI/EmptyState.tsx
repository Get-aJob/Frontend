import React from 'react';
import clsx from 'clsx';
import { Inbox } from 'lucide-react';
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState = ({ icon, title, description, action, className }: EmptyStateProps) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className,
      )}
    >
      <div className="w-16 h-16 mb-4 text-gray-400 flex items-center justify-center bg-gray-50 rounded-full shadow-inner">
        {icon || <Inbox size={32} />}
      </div>

      <h3 className="text-subtitle font-bold text-gray-800 mb-2">{title}</h3>
      {description && <p className="text-body text-gray-500 mb-6">{description}</p>}

      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
