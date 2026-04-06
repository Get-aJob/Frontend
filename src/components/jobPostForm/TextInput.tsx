import { forwardRef, useId, type InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, ...props }, ref) => {
    const inputId = useId();
    return (
      <div className="w-full">
        <label htmlFor={inputId} className="text-[13px] text-gray-700 font-bold mb-2 block ml-1">
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          className={`w-full bg-white border rounded-xl py-3 px-4 text-sm outline-none transition-all focus:ring-1 focus:ring-btn-point placeholder:text-gray-300 ${
            error ? 'border-red-500 ring-red-100' : 'border-gray-200 focus:border-btn-point'
          }`}
          {...props}
        />
        {error && <p className="text-red-500 text-[11px] mt-1.5 ml-1 font-medium">{error}</p>}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
export default TextInput;
