import { forwardRef, useId, type InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface DeadlineInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isAlwaysRecruit?: boolean;
  onAlwaysRecruitChange?: (checked: boolean) => void;
  wrapperClassName?: string;
  error?: string;
}

const STYLES = {
  header: 'flex justify-between items-center mb-[6px]',
  label: 'text-[12px] text-[#6b7280] font-[600] m-0 block',
  checkboxLabel:
    'text-[11.5px] text-[#6b7280] flex items-center gap-[5px] cursor-pointer font-[600]',
  checkbox: 'w-[13px] h-[13px] accent-[#4f46e5]',
  input:
    'w-full bg-[#f8f9fc] border-[1.5px] border-[#e8eaf0] rounded-[9px] py-[9px] px-[13px] text-[13.5px] outline-none box-border disabled:opacity-50 disabled:cursor-not-allowed focus:border-[#4f46e5] transition-colors',
  errorText: 'text-red-500 text-[11px] mt-1',
};

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
        <div className={STYLES.header}>
          <label htmlFor={deadlineInputId} className={STYLES.label}>
            마감일
          </label>
          <label className={STYLES.checkboxLabel}>
            <input
              type="checkbox"
              checked={isAlwaysRecruit}
              onChange={(e) => onAlwaysRecruitChange?.(e.target.checked)}
              className={STYLES.checkbox}
            />
            상시 모집
          </label>
        </div>
        <input
          {...props}
          id={deadlineInputId}
          ref={ref}
          className={clsx(STYLES.input, error && 'border-red-500', className)}
          type="date"
          disabled={isAlwaysRecruit || disabled}
          title="마감일"
        />
        {error && <p className={STYLES.errorText}>{error}</p>}
      </div>
    );
  },
);

DeadlineInput.displayName = 'DeadlineInput';

export default DeadlineInput;
