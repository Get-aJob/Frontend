import { FileCheck } from 'lucide-react';

const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  // 로그 함수를 이용해 어느 단위에 속하는지 인덱스를 찾습니다.
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

interface ResumeFormPortfolioItemProps {
  name: string;
  file: File | null;
}

const ResumeFormPortfolioItem = ({ name, file }: ResumeFormPortfolioItemProps) => {
  return (
    <div className="flex gap-5">
      <FileCheck />
      <p>{name}</p>
      <p>
        {file instanceof File
          ? `파일 크기 : ${formatFileSize(file.size)}`
          : `내부 저장소에 저장 됨`}
      </p>
    </div>
  );
};

export default ResumeFormPortfolioItem;
