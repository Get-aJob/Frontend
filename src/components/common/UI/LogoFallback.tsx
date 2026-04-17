import React from 'react';
import { Building2 } from 'lucide-react';
import clsx from 'clsx';

interface LogoFallbackProps {
  size?: number;
  className?: string;
  iconClassName?: string;
}

const LogoFallback: React.FC<LogoFallbackProps> = ({ size = 24, className, iconClassName }) => {
  return (
    <div
      className={clsx('flex items-center justify-center overflow-hidden bg-gray-50/50', className)}
    >
      <Building2 size={size} className={clsx('text-gray-300', iconClassName)} />
    </div>
  );
};

export default LogoFallback;
