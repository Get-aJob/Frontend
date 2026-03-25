import { useState, useRef, useEffect } from 'react';
import type { ViewType } from '@/types/Calendar';

interface Props {
  view: ViewType;
  setView: (v: ViewType) => void;
  currentDate: Date;
  setCurrentDate: (d: Date) => void;
}

const CalendarHeader = ({ view, setView, currentDate, setCurrentDate }: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const moveDate = (direction: number) => {
    const next = new Date(currentDate);
    if (view === 'month') next.setMonth(currentDate.getMonth() + direction);
    else if (view === 'week') next.setDate(currentDate.getDate() + direction * 7);
    else next.setDate(currentDate.getDate() + direction);
    setCurrentDate(next);
  };

  const viewLabels: Record<ViewType, string> = {
    month: '월간',
    week: '주간',
    day: '일간',
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-100 pb-6">
      <h1 className="text-3xl font-black text-gray-900 tracking-tighter">
        {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
      </h1>

      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors shadow-sm"
          >
            {viewLabels[view]}
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              {(Object.keys(viewLabels) as ViewType[]).map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setView(v);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors ${
                    view === v ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {viewLabels[v]}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          <button
            onClick={() => moveDate(-1)}
            className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-gray-400 hover:text-gray-600 transition-all"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-1.5 text-gray-600 font-extrabold rounded-xl text-sm hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all"
          >
            오늘
          </button>
          <button
            onClick={() => moveDate(1)}
            className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-gray-400 hover:text-gray-600 transition-all"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
