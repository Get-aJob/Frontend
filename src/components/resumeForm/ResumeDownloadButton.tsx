import { downloadResumePdf } from '@/features/pdf/utiles/generatePdf';
import { useGetResume } from '@/hooks/resume';
import { useAuthStore } from '@/store/useAuthStore';
import type { ResumeFormInputs } from '@/types/ResumeFormType';
import { dataToResume } from '@/utils/resumeUtils';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';

interface ResumeDownloadButtonProps {
  data?: ResumeFormInputs;
  className?: string;
  id?: string;
  children: React.ReactNode;
}

const ResumeDownloadButton = ({ data, id, className, children }: ResumeDownloadButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: value } = useGetResume(id);
  const { user } = useAuthStore();

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 150)); // UI 업데이트를 위해 150ms 대기
      if (data) {
        await downloadResumePdf(data, user?.name);
      } else if (id && value) {
        const resume = dataToResume(value);

        await downloadResumePdf(resume, user?.name);
      } else {
        alert('데이터를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('PDF 생성 에러:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <button onClick={handleDownload} disabled={isGenerating} className={`flex ${className || ''}`}>
      {isGenerating ? <LoaderCircle className="animate-spin" /> : children}
    </button>
  );
};

export default ResumeDownloadButton;
