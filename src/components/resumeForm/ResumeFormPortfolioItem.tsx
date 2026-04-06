import { FileText } from 'lucide-react';

interface ResumeFormPortfolioItemProps {
  name: string;
  file: File | null;
}

const ResumeFormPortfolioItem = ({ name, file }: ResumeFormPortfolioItemProps) => {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-btn-point shrink-0">
        <FileText size={20} />
      </div>
      <div className="flex flex-col items-start">
        <p className="text-sm font-bold text-gray-900 line-clamp-1 text-left">
          {name || '제목 없음'}
        </p>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          {file instanceof File ? formatBytes(file.size) : '저장된 파일'}
        </p>
      </div>
    </div>
  );
};

export default ResumeFormPortfolioItem;
