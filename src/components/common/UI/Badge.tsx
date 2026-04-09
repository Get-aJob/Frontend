import React from 'react';
import clsx from 'clsx';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  // ✨ blue, rose, emerald 추가
  variant?: 'point' | 'success' | 'error' | 'warning' | 'default' | 'blue' | 'rose' | 'emerald';
  children: React.ReactNode;
}

const Badge = ({ variant = 'default', className, children, ...props }: BadgeProps) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[11px] font-extrabold whitespace-nowrap',

        variant === 'point' && 'bg-purple-50 text-btn-point', // 태그, 전체
        variant === 'success' && 'bg-green-50 text-status-success', // 합격, 상시채용
        variant === 'error' && 'bg-red-50 text-status-error', // 불합격, D-Day, 마감
        variant === 'warning' && 'bg-orange-50 text-orange-500', // 서류심사중, 면접대기
        variant === 'default' && 'bg-gray-100 text-gray-600', // 기타 기본값

        variant === 'blue' && 'bg-blue-50 text-blue-600',
        variant === 'rose' && 'bg-rose-50 text-rose-600',
        variant === 'emerald' && 'bg-emerald-50 text-emerald-600',

        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
