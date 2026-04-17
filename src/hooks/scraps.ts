import { getMyScraps, toggleScrap, type ScrapItem, type ScrapSortType } from '@/api/Scrap';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllScraps = (isLoggedIn: boolean) => {
  return useQuery<ScrapItem[], Error>({
    queryKey: ['scraps', 'all'],
    queryFn: async () => {
      const scrapData: ScrapItem[] = [];
      const limit = 100;
      let page = 1;
      while (true) {
        const res = await getMyScraps(page++, limit);
        scrapData.push(...res.scraps);
        if (!res.pagination.hasNext) {
          break;
        }
      }
      return scrapData;
    },
    placeholderData: [],
    enabled: isLoggedIn,
  });
};

export const useMyScraps = (
  currentPage: number,
  pageSize: number,
  sortBy: ScrapSortType | undefined,
) => {
  return useQuery({
    // 💡 1. 쿼리 키 설정 (페이지와 정렬 기준이 바뀔 때마다 다시 호출)
    queryKey: ['scraps', currentPage, sortBy],

    // 💡 2. 데이터 페칭 함수
    queryFn: () => getMyScraps(currentPage, pageSize, sortBy),

    // 💡 3. 유용한 옵션들
    placeholderData: (previousData) => previousData, // 페이지 전환 시 깜빡임 방지
    staleTime: 0, // 💡 즉각적인 반영을 위해 staleTime을 0으로 설정
  });
};

export const useToggleScraps = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await toggleScrap(id);
    },
    onSuccess: () => {
      // ✨ 페이지나 정렬에 상관없이 모든 스크랩 관련 데이터 동기화
      queryClient.invalidateQueries({ queryKey: ['scraps'] });
    },
    onError: (error) => {
      console.error('저장 실패:', error);
      alert('저장 중 오류가 발생했습니다.');
    },
  });
};
