import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-6">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 rounded-xl border border-border-light text-gray-600 hover:bg-gray-50 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        <ChevronLeft size={20} strokeWidth={2.5} />
      </button>

      {getPageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-xl text-sm font-black transition-all cursor-pointer ${
            currentPage === page
              ? 'bg-btn-point text-white shadow-lg shadow-purple-100 scale-105'
              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 rounded-xl border border-border-light text-gray-600 hover:bg-gray-50 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default Pagination;
