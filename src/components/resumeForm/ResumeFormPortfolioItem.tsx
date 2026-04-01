import { FileCheck } from 'lucide-react';

interface ResumeFormPortfolioItemProps {
  name: string;
  file: File | null;
}

const ResumeFormPortfolioItem = ({ name, file }: ResumeFormPortfolioItemProps) => {
  return (
    <div className="flex gap-5">
      <FileCheck />
      <p>{name}</p>
      <p>{file instanceof File ? `파일 크기 : ${file.size}` : `내부 저장소에 저장 됨`}</p>
    </div>
  );
};

export default ResumeFormPortfolioItem;
