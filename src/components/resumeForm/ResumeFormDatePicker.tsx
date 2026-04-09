import DatePicker from 'react-datepicker';
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect, useRef, useState } from 'react';
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
        if (isOpen) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => {
        return (
          <div className="relative">
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              className={clsx(
                disabled ? 'hidden' : 'w-30 rounded-lg hover:bg-black/10',
                value ? 'text-black' : 'text-black/40',
              )}
            >
              {value ? value : 'YYYY-MM-DD'}
            </button>
            <div
              ref={calendarRef}
              className={clsx(isOpen ? 'absolute top-6 left-0 z-10' : 'hidden')}
            >
              <DatePicker
                inline
                selected={value}
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
                dateFormat="yyyyMM.dd"
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
                placeholderText={placeholder}
              />
            </div>
          </div>
        );
      }}
    />
  );
};

export default ResumeFormDatePicker;
