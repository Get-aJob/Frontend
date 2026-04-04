import DatePicker from 'react-datepicker';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect, useRef, useState } from 'react';
import { ko } from 'date-fns/locale';
import clsx from 'clsx';

interface ResumeFormDatePickerProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  disabled: boolean;
  placeholder?: string;
}

const ResumeFormDatePicker = <T extends FieldValues>({
  name,
  control,
  disabled,
  placeholder,
}: ResumeFormDatePickerProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        buttonRef.current &&
        !(
          calendarRef.current.contains(e.target as Node) ||
          buttonRef.current.contains(e.target as Node)
        )
      ) {
        if (isOpen) setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <div className="relative">
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            disabled={disabled}
            className={clsx(
              'px-3 py-1.5 rounded-lg border bg-white text-sm transition-all outline-none',
              disabled
                ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200'
                : 'border-gray-200 hover:border-btn-point hover:text-btn-point focus:border-btn-point focus:ring-1 focus:ring-btn-point cursor-pointer',
              value ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium',
            )}
          >
            {value ? value : placeholder || 'YYYY.MM.DD'}
          </button>

          <div
            ref={calendarRef}
            className={clsx(
              isOpen
                ? 'absolute top-10 left-0 z-50 shadow-xl rounded-lg overflow-hidden border border-gray-100 bg-white'
                : 'hidden',
            )}
          >
            <DatePicker
              locale={ko}
              inline
              selected={value ? new Date(value) : null}
              onChange={(date: Date | null) => {
                if (date) {
                  const formatted = date.toLocaleDateString('sv-SE');
                  onChange(formatted);
                  setIsOpen(false);
                } else {
                  onChange(null);
                }
              }}
              disabled={disabled}
              dateFormat="yyyy.MM.dd"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              yearDropdownItemNumber={100}
              scrollableYearDropdown
              onKeyDown={(e) => e.preventDefault()}
            />
          </div>
        </div>
      )}
    />
  );
};

export default ResumeFormDatePicker;
