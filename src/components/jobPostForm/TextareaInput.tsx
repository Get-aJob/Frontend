import { forwardRef } from 'react';
import TextareaAutosize, { type TextareaAutosizeProps } from 'react-textarea-autosize';
import { clsx } from 'clsx';

interface TextareaInputProps extends TextareaAutosizeProps {
  label: string;
  className?: string;
  wrapperClassName?: string;
  error?: string;
}

const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  ({ label, className = '', wrapperClassName = 'mb-[13px]', error, ...props }, ref) => {
    return (
      <div className={wrapperClassName}>
        <label className="text-[12px] text-[#6b7280] font-[600] mb-[6px] block">{label}</label>
        <TextareaAutosize
          ref={ref}
          className={clsx(
            'w-full bg-[#f8f9fc] border-[1.5px] border-[#e8eaf0] rounded-[9px] py-[9px] px-[13px] text-[13.5px] outline-none box-border focus:border-[#4f46e5] transition-colors min-h-[100px] overflow-hidden',
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

TextareaInput.displayName = 'TextareaInput';

export default TextareaInput;
