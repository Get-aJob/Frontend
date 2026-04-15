import { getMyScraps, type ScrapItem } from '@/api/Scrap';
import { useQuery } from '@tanstack/react-query';

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
