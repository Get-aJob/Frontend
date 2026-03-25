import { downloadResumePdf } from '@/features/pdf/utiles/generatePdf';
import type { ResumeFormInputs } from '@/types/ResumeFormType';
import { Download, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

interface ResumeDownloadButtonProps {
  data: ResumeFormInputs;
  className?: string;
}
const ResumeDownloadButton = ({ data, className }: ResumeDownloadButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 150)); // UI 업데이트를 위해 150ms 대기
      await downloadResumePdf(data);
    } catch (error) {
      console.error('PDF 생성 에러:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <button onClick={handleDownload} disabled={isGenerating} className={className}>
      {isGenerating ? <LoaderCircle className="animate-spin" /> : <Download />}
    </button>
  );
};

export default ResumeDownloadButton;
