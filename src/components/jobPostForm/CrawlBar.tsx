import type { JobPostFields } from './JobModal';

interface CrawlBarProps {
  url: string;
  onUrlChange: (url: string) => void;
  onParse: (data: Partial<JobPostFields>) => void;
}

const CrawlBar = ({ url, onUrlChange, onParse }: CrawlBarProps) => {
  const handleCrawlClick = async () => {
    const mockParsedData: Partial<JobPostFields> = {
      title: '프론트엔드 개발자 (크롤링 테스트)',
      company_name: '테스트 회사',
    };

    onParse(mockParsedData);
  };

  return (
    <div>
      <input value={url} onChange={(e) => onUrlChange(e.target.value)} />
      <button onClick={handleCrawlClick}>불러오기</button>
    </div>
  );
};

export default CrawlBar;
