import { forwardRef, useId } from 'react';
import TextareaAutosize, { type TextareaAutosizeProps } from 'react-textarea-autosize';

interface TextareaInputProps extends TextareaAutosizeProps {
  label: string;
  error?: string;
}

const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  ({ label, error, ...props }, ref) => {
    const inputId = useId();
    return (
      <div className="w-full mt-4">
        <label htmlFor={inputId} className="text-[13px] text-gray-700 font-bold mb-2 block ml-1">
          {label}
        </label>
        <TextareaAutosize
          id={inputId}
          ref={ref}
          className={`w-full bg-white border rounded-xl py-3 px-4 text-sm outline-none transition-all focus:ring-1 focus:ring-btn-point placeholder:text-gray-300 min-h-[120px] resize-none ${
            error ? 'border-red-500 ring-red-100' : 'border-gray-200 focus:border-btn-point'
          }`}
          {...props}
        />
        {error && <p className="text-red-500 text-[11px] mt-1.5 ml-1 font-medium">{error}</p>}
      </div>
    );
  },
);

TextareaInput.displayName = 'TextareaInput';
export default TextareaInput;
