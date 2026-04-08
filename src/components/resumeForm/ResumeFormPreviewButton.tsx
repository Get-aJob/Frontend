import ResumeDocument from '@/features/pdf/templates/ResumeDocument';
import { useGetResume } from '@/hooks/resume';
import { useAuthStore } from '@/store/useAuthStore';
import { usePreviewStore } from '@/store/usePdfPreviewStore';
import { dataToResume } from '@/utils/resumeUtils';
import { pdf } from '@react-pdf/renderer';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';

interface ResumeFormPreviewButtonProps {
  className?: string;
  id?: string;
  children: React.ReactNode;
}

const ResumeFormPreviewButton = ({ className, id, children }: ResumeFormPreviewButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: value } = useGetResume(id);
  const { user } = useAuthStore();
  const openPreview = usePreviewStore((state) => state.openPreview);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 150)); // UI 업데이트를 위해 150ms 대기
    try {
      if (id && value) {
        const resume = dataToResume(value);
        let blob: Blob | null = null;
        const doc = <ResumeDocument data={resume} userName={user?.name} />;
        blob = await pdf(doc).toBlob();
        openPreview(new File([blob], resume.title, { type: 'application/pdf' }), resume.title);
      } else {
        alert('데이터를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('PDF 미리보기 생성 에러:', error);
      alert('불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };
  return (
    <button onClick={handleGenerate} disabled={isGenerating} className={`flex ${className || ''}`}>
      {isGenerating ? <LoaderCircle className="animate-spin" /> : children}
    </button>
  );
};

export default ResumeFormPreviewButton;
