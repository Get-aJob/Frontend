import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { usePostingStore } from '@/store/usePostingStore';

const SearchBar = () => {
  const { searchKeyword, setSearchKeyword, fetchPostings, selectedSite } = usePostingStore();
  const [inputValue, setInputValue] = useState(searchKeyword);

  // 서버 부하를 줄이기 위한 디바운스 검색 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchKeyword) {
        setSearchKeyword(inputValue);
        fetchPostings(1, selectedSite, inputValue);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, setSearchKeyword, fetchPostings, selectedSite, searchKeyword]);

  const handleClear = useCallback(() => {
    setInputValue('');
    setSearchKeyword('');
    fetchPostings(1, selectedSite, '');
  }, [setSearchKeyword, fetchPostings, selectedSite]);

  return (
    <div className="relative z-[10] w-full py-2">
      <div className="relative w-full mx-auto transition-all duration-500 group max-w-3xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search
            size={20}
            className="text-gray-500 group-focus-within:text-btn-point transition-all duration-300"
          />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-12 bg-white border border-gray-200 rounded-2xl 
                     focus:outline-none focus:ring-4 focus:ring-purple-50/50 focus:border-btn-point 
                     transition-all duration-500 text-[15px] font-medium placeholder:text-gray-500 py-3
                     shadow-sm"
          placeholder="나에게 딱 맞는 공고를 검색해보세요"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        )}

        {/* 검색창 효과 */}
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-[2.5rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700 -z-20" />
      </div>
    </div>
  );
};

export default SearchBar;
