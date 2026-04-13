import { useState, useEffect, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { usePostingStore } from '@/store/usePostingStore';

const SearchBar = () => {
  const { searchKeyword, setSearchKeyword, fetchPostings, selectedSite } = usePostingStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [inputValue, setInputValue] = useState(searchKeyword);
  const [isFocused, setIsFocused] = useState(false);
  const [prevSearchKeyword, setPrevSearchKeyword] = useState(searchKeyword);

  // 외부에서 검색어가 변경될 경우(예: 초기화) 내부 상태와 동기화 (렌더링 단계에서 처리하여 린트 오류 방지)
  if (!isFocused && searchKeyword !== prevSearchKeyword) {
    setPrevSearchKeyword(searchKeyword);
    setInputValue(searchKeyword);
  }

  // 서버 부하를 줄이기 위한 디바운스 검색 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchKeyword) {
        setSearchKeyword(inputValue);

        // URL 파라미터 업데이트
        const params = new URLSearchParams(searchParams);
        if (inputValue) {
          params.set('keyword', inputValue);
        } else {
          params.delete('keyword');
        }
        setSearchParams(params, { replace: true });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, setSearchKeyword, fetchPostings, selectedSite, searchKeyword]);

  const handleClear = useCallback(() => {
    setInputValue('');
    setSearchKeyword('');
  }, [setSearchKeyword]);

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
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
