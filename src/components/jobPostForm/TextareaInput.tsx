import { forwardRef, useId } from 'react';
import TextareaAutosize, { type TextareaAutosizeProps } from 'react-textarea-autosize';
import { clsx } from 'clsx';

interface TextareaInputProps extends TextareaAutosizeProps {
  label: string;
  className?: string;
  wrapperClassName?: string;
  error?: string;
}

const STYLES = {
  label: 'text-[12px] text-[#6b7280] font-[600] mb-[6px] block',
  textarea:
    'w-full bg-[#f8f9fc] border-[1.5px] border-[#e8eaf0] rounded-[9px] py-[9px] px-[13px] text-[13.5px] outline-none box-border focus:border-[#4f46e5] transition-colors min-h-[100px] overflow-hidden',
  errorText: 'text-red-500 text-[11px] mt-1',
};

const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  ({ label, className = '', wrapperClassName = 'mb-[13px]', error, ...props }, ref) => {
    const defaultId = useId();
    const textareaId = props.id ?? defaultId;
    return (
      <div className={wrapperClassName}>
        <label htmlFor={textareaId} className={STYLES.label}>
          {label}
        </label>
        <TextareaAutosize
          id={textareaId}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          className={clsx(STYLES.textarea, error && 'border-red-500', className)}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className={STYLES.errorText}>
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextareaInput.displayName = 'TextareaInput';

export default TextareaInput;
