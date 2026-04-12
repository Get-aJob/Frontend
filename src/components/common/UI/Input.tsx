import React from 'react';
import clsx from 'clsx';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={clsx(
        'w-full bg-bg-view border-[1.5px] border-border-light rounded-lg px-3.5 py-2.5',
        'text-sm outline-none transition-all duration-200',
        'focus:border-btn-point focus:ring-2 focus:ring-purple-100',
        'placeholder:text-gray-400 disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;
