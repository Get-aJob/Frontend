import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  // 표시할 페이지 번호 생성 로직
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  // totalPages가 0인 경우에만 숨김 (1개일 때도 보이게 수정)
  if (totalPages < 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-6">
      {/* 처음으로 */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(1)}
        className="w-11 h-11 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer bg-white"
      >
        <ChevronsLeft size={18} strokeWidth={2} />
      </button>

      {/* 이전 */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all cursor-pointer
          ${
            currentPage === 1
              ? 'bg-gray-50 border-gray-100 text-gray-300 opacity-50 cursor-not-allowed'
              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
          }`}
      >
        <ChevronLeft
          size={18}
          strokeWidth={2.5}
          className={currentPage === 1 ? '' : 'text-btn-point'}
        />
      </button>

      {/* 페이지 번호 */}
      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-11 h-11 rounded-xl text-base font-bold transition-all cursor-pointer border
            ${
              currentPage === page
                ? 'bg-btn-point text-white border-transparent shadow-lg shadow-indigo-200 scale-105'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
            }`}
        >
          {page}
        </button>
      ))}

      {/* 다음 */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all cursor-pointer
          ${
            currentPage === totalPages
              ? 'bg-gray-50 border-gray-100 text-gray-300 opacity-50 cursor-not-allowed'
              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
          }`}
      >
        <ChevronRight
          size={18}
          strokeWidth={2.5}
          className={currentPage === totalPages ? '' : 'text-btn-point'}
        />
      </button>

      {/* 마지막으로 */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(totalPages)}
        className="w-11 h-11 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer bg-white"
      >
        <ChevronsRight size={18} strokeWidth={2} />
      </button>
    </div>
  );
};

export default Pagination;
