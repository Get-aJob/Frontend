import { forwardRef, useId, type InputHTMLAttributes } from 'react';

interface DeadlineInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isAlwaysRecruit: boolean;
  onAlwaysRecruitChange: (checked: boolean) => void;
  error?: string;
}

const DeadlineInput = forwardRef<HTMLInputElement, DeadlineInputProps>(
  ({ isAlwaysRecruit, onAlwaysRecruitChange, error, ...props }, ref) => {
    const inputId = useId();
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2 px-1">
          <label htmlFor={inputId} className="text-subtitle text-gray-700 font-bold block">
            마감일
          </label>
          <label className="text-body text-gray-500 flex items-center gap-1.5 cursor-pointer font-bold hover:text-btn-point transition-colors">
            <input
              type="checkbox"
              checked={isAlwaysRecruit}
              onChange={(e) => onAlwaysRecruitChange(e.target.checked)}
              className="w-4 h-4 rounded accent-btn-point cursor-pointer"
            />
            상시 모집
          </label>
        </div>
        <input
          {...props}
          id={inputId}
          ref={ref}
          type="date"
          disabled={isAlwaysRecruit}
          value={isAlwaysRecruit ? '' : props.value}
          className={`w-full bg-white border rounded-xl py-2.5 px-4 text-sm outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60 ${
            error ? 'border-red-500' : 'border-gray-200 focus:border-btn-point'
          }`}
        />
        {error && <p className="text-red-500 text-[11px] mt-1 ml-1 font-medium">{error}</p>}
      </div>
    );
  },
);

DeadlineInput.displayName = 'DeadlineInput';
export default DeadlineInput;
