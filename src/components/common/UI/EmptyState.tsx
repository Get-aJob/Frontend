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
    <div className={clsx('flex flex-col items-center justify-center text-center', className)}>
      <div className="w-16 h-16 mb-4 text-gray-400 flex items-center justify-center bg-gray-50 rounded-full shadow-inner">
        {icon || <Inbox size={32} />}
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 whitespace-pre-wrap leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
