import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
  wrapperClassName?: string;
  error?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, className = '', wrapperClassName = 'mb-[13px]', error, ...props }, ref) => {
    const defaultId = useId();
    const inputId = props.id ?? defaultId;
    return (
      <div className={wrapperClassName}>
        <label htmlFor={inputId} className="text-[12px] text-[#6b7280] font-[600] mb-[6px] block">
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={clsx(
            'w-full bg-[#f8f9fc] border-[1.5px] border-[#e8eaf0] rounded-[9px] py-[9px] px-[13px] text-[13.5px] outline-none box-border focus:border-[#4f46e5] transition-colors',
            error ? 'border-red-500' : '',
            className,
          )}
          {...props}
        />
        {error && <p className="text-red-500 text-[11px] mt-1">{error}</p>}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;
