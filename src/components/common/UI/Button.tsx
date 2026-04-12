import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          'inline-flex items-center justify-center font-bold transition-all duration-200',
          'active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',

          /* ✨ 모바일 환경을 고려한 초소형 텍스트 및 패딩 적용 */
          size === 'sm' && 'px-2 py-0.5 text-[9px] sm:text-[11px] rounded-md',
          size === 'md' && 'px-3 py-1 text-[10px] sm:text-subtitle rounded-lg',
          size === 'lg' && 'px-4 py-2 text-[12px] sm:text-title rounded-xl',

          variant === 'primary' &&
            'bg-btn-point text-white shadow-sm hover:scale-105 hover:shadow-md',
          variant === 'outline' &&
            'border-[1.5px] border-btn-point text-btn-point bg-white hover:bg-purple-50',
          variant === 'ghost' && 'text-gray-500 hover:text-gray-900 hover:bg-gray-100',
          className,
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-1.5 animate-spin" size={12} />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
