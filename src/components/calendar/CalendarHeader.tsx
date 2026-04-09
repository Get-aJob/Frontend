import { useState, useRef, useEffect } from 'react';
import type { ViewType, EventFilterType } from '@/types/Calendar';
import { ChevronDown, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import Badge from '@/components/common/UI/Badge';
import { useAuthStore } from '@/store/useAuthStore'; // ✨ AuthStore 추가

interface Props {
  view: ViewType;
  setView: (v: ViewType) => void;
  currentDate: Date;
  setCurrentDate: (d: Date) => void;
  filter: EventFilterType;
  setFilter: (f: EventFilterType) => void;
}

const CalendarHeader = ({
  view,
  setView,
  currentDate,
  setCurrentDate,
  filter,
  setFilter,
}: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useAuthStore(); // ✨ 로그인 상태 가져오기

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
    if (view === 'month') {
      next.setMonth(currentDate.getMonth() + direction);
    } else if (view === 'week') {
      next.setDate(currentDate.getDate() + direction * 7);
    } else {
      next.setDate(currentDate.getDate() + direction);
    }
    setCurrentDate(next);
  };

  const viewLabels: Record<ViewType, string> = {
    month: '월간',
    week: '주간',
    day: '일간',
  };

  return (
    <div className="flex flex-col gap-6 pb-2 mb-2">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-title font-black text-gray-900 tracking-tighter shrink-0">
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </h1>

        <div className="flex flex-1 items-center gap-6 justify-end">
          <div className="flex items-center gap-2 border-r border-border-light pr-6 mr-1">
            <div className="flex items-center gap-1.5 text-gray-400 mr-2 shrink-0">
              <Filter size={14} strokeWidth={3} />
              <span className="text-[11px] font-black uppercase tracking-wider">Filter</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setFilter('all')} className="cursor-pointer">
                <Badge
                  variant={filter === 'all' ? 'point' : 'default'}
                  className={filter === 'all' ? 'ring-2 ring-purple-100' : 'opacity-60'}
                >
                  전체
                </Badge>
              </button>

              {/* ✨ 비로그인 시 수동 공고 필터 숨김 */}
              {isLoggedIn && (
                <button onClick={() => setFilter('manual')} className="cursor-pointer">
                  <Badge
                    variant={filter === 'manual' ? 'rose' : 'default'}
                    className={filter === 'manual' ? 'ring-2 ring-rose-100' : 'opacity-60'}
                  >
                    수동 공고
                  </Badge>
                </button>
              )}

              <button onClick={() => setFilter('auto')} className="cursor-pointer">
                <Badge
                  variant={filter === 'auto' ? 'blue' : 'default'}
                  className={filter === 'auto' ? 'ring-2 ring-blue-100' : 'opacity-60'}
                >
                  자동 공고
                </Badge>
              </button>

              {/* ✨ 비로그인 시 지원 현황 필터 숨김 */}
              {isLoggedIn && (
                <button onClick={() => setFilter('applied')} className="cursor-pointer">
                  <Badge
                    variant={filter === 'applied' ? 'emerald' : 'default'}
                    className={filter === 'applied' ? 'ring-2 ring-emerald-100' : 'opacity-60'}
                  >
                    지원 현황
                  </Badge>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1 bg-white border border-border-light hover:bg-gray-50 text-gray-700 font-extrabold rounded-full text-[11px] transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                {viewLabels[view]}
                <ChevronDown
                  size={12}
                  className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-white rounded-xl shadow-xl border border-border-light overflow-hidden z-100 animate-[fadeInUp_0.2s_ease]">
                  {(Object.keys(viewLabels) as ViewType[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setView(v);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-[11px] font-bold transition-colors cursor-pointer ${view === v ? 'bg-purple-50 text-btn-point' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      {viewLabels[v]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center bg-gray-100 p-0.5 rounded-full border border-border-light">
              <button
                onClick={() => moveDate(-1)}
                className="p-1.5 hover:bg-white hover:shadow-sm rounded-full text-gray-400 cursor-pointer transition-all"
              >
                <ChevronLeft size={14} strokeWidth={3} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-gray-600 font-extrabold rounded-full text-[11px] hover:bg-white hover:text-btn-point hover:shadow-sm transition-all cursor-pointer"
              >
                오늘
              </button>
              <button
                onClick={() => moveDate(1)}
                className="p-1.5 hover:bg-white hover:shadow-sm rounded-full text-gray-400 cursor-pointer transition-all"
              >
                <ChevronRight size={14} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
