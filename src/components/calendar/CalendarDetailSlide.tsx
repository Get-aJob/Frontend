import { createPortal } from 'react-dom';
import type { ScheduleEvent } from '@/types/Calendar';

interface Props {
  isOpen: boolean;
  event: ScheduleEvent | null;
  onClose: () => void;
}

const CalendarDetailSlide = ({ isOpen, event, onClose }: Props) => {
  if (!event) return null;

  return createPortal(
    <>
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 z-9998 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-100 bg-white shadow-[-15px_0_40px_rgba(0,0,0,0.1)] z-9999 transform transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 pb-2 flex justify-between items-center">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <span className="text-[10px] font-black text-gray-300 tracking-[0.3em] uppercase">
              Detail View
            </span>
          </div>

          <div className="px-8 py-4 flex-1 overflow-y-auto">
            <div className="flex items-center gap-4 mb-8">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-md shrink-0 overflow-hidden ${
                  event.companyLogo
                    ? 'bg-white border border-gray-100'
                    : event.eventType === 'deadline'
                      ? 'bg-linear-to-br from-rose-500 to-rose-600'
                      : 'bg-linear-to-br from-emerald-500 to-emerald-600'
                }`}
              >
                {event.companyLogo ? (
                  <img
                    src={event.companyLogo}
                    alt={`${event.companyName} 로고`}
                    className="w-full h-full object-contain p-1.5"
                    onError={(ev) => {
                      ev.currentTarget.style.display = 'none';
                      const parent = ev.currentTarget.parentElement;
                      if (parent) {
                        parent.classList.remove('bg-white', 'border', 'border-gray-100');
                        parent.classList.add(
                          'bg-linear-to-br',
                          event.eventType === 'deadline' ? 'from-rose-500' : 'from-emerald-500',
                          event.eventType === 'deadline' ? 'to-rose-600' : 'to-emerald-600',
                        );
                        parent.innerText = event.companyName[0];
                      }
                    }}
                  />
                ) : (
                  event.companyName[0]
                )}
              </div>
              {/* 💡 여기까지 */}

              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
                  {event.companyName}
                </h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${event.eventType === 'deadline' ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  ></span>
                  <p className="text-xs font-bold text-gray-400">
                    {event.eventType === 'deadline' ? '채용 마감일' : '지원 완료일'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1 block">
                  Position
                </label>
                <p className="text-lg font-bold text-gray-800 leading-snug">{event.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                    Date
                  </label>
                  <p className="text-md font-bold text-gray-700">{event.date}</p>
                </div>
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">
                    Status
                  </label>
                  <div
                    className={`mt-1 inline-block text-[11px] font-black ${event.isApplied ? 'text-indigo-600' : 'text-gray-400'}`}
                  >
                    {event.isApplied ? '✓ APPLIED' : 'NOT APPLIED'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 mt-auto">
            <button className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-md hover:bg-indigo-600 transition-all shadow-lg active:scale-[0.97]">
              공고 보기
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
};

export default CalendarDetailSlide;
