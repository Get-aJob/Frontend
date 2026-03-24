import { forwardRef, useId, type InputHTMLAttributes } from 'react';

interface DeadlineInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isAlwaysRecruit?: boolean;
  onAlwaysRecruitChange?: (checked: boolean) => void;
  wrapperClassName?: string;
  error?: string;
}

const DeadlineInput = forwardRef<HTMLInputElement, DeadlineInputProps>(
  (
    {
      isAlwaysRecruit = false,
      onAlwaysRecruitChange,
      wrapperClassName = 'mb-[13px]',
      className = '',
      error,
      disabled,
      ...props
    },
    ref,
  ) => {
    const defaultId = useId();
    const deadlineInputId = props.id ?? defaultId;

    return (
      <div className={wrapperClassName}>
        <div className="flex justify-between items-center mb-[6px]">
          <label
            htmlFor={deadlineInputId}
            className="text-[12px] text-[#6b7280] font-[600] m-0 block"
          >
            마감일
          </label>
          <label className="text-[11.5px] text-[#6b7280] flex items-center gap-[5px] cursor-pointer font-[600]">
            <input
              type="checkbox"
              checked={isAlwaysRecruit}
              onChange={(e) => onAlwaysRecruitChange?.(e.target.checked)}
              className="w-[13px] h-[13px] accent-[#4f46e5]"
            />
            상시 모집
          </label>
        </div>
        <input
          {...props}
          id={deadlineInputId}
          ref={ref}
          className={`w-full bg-[#f8f9fc] border-[1.5px] border-[#e8eaf0] rounded-[9px] py-[9px] px-[13px] text-[13.5px] outline-none box-border disabled:opacity-50 disabled:cursor-not-allowed focus:border-[#4f46e5] transition-colors ${
            error ? 'border-red-500' : ''
          } ${className}`}
          type="date"
          disabled={isAlwaysRecruit || disabled}
          title="마감일"
        />
        {error && <p className="text-red-500 text-[11px] mt-1">{error}</p>}
      </div>
    );
  },
);

DeadlineInput.displayName = 'DeadlineInput';

export default DeadlineInput;
