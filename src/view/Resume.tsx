import { useResumeList } from '@/hooks/resume';
import ResumeItem from '@/components/resume/ResumeItem';
import CreateButton from '@/components/resume/CreateButton';
import EmptyState from '@/components/common/UI/EmptyState';
import Skeleton from '@/components/common/UI/Skeleton';
import { FileText, Plus } from 'lucide-react';
import type { ResumeInfo } from '@/types/ResumeFormType';

const Resume = () => {
  const { data: resumes, isLoading } = useResumeList();
  // const { data: resumes, isLoading, deleteResume } = useResumeList();

  return (
    <div className="animate-[fadeUp_0.3s_ease] pb-20">
      <header className="flex justify-between items-end mb-10 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-body text-gray-500 mt-2 font-medium">
            나만의 전문성을 보여줄 수 있는 이력서를 작성하고 관리하세요.
          </h1>
        </div>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : resumes && resumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CreateButton
            icon={<Plus size={24} />}
            title="새 이력서 작성"
            sub="새로운 이력서를 생성합니다"
            path="/resume/new"
          />
          {resumes.map((resume: ResumeInfo) => (
            <ResumeItem
              key={resume.id}
              resume={resume}
              // onDelete={() => deleteResume(resume.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-24 bg-white rounded-2xl border border-gray-100 shadow-sm text-center">
          <EmptyState
            icon={<FileText size={48} />}
            title="등록된 이력서가 없습니다"
            description="새로운 이력서를 작성하고 취업 성공에 한 발짝 더 다가가세요!"
            action={
              <div className="w-64 mx-auto mt-4">
                <CreateButton
                  icon={<Plus size={24} />}
                  title="이력서 만들기"
                  sub="클릭하여 시작하기"
                  path="/resume/new"
                />
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};

export default Resume;
