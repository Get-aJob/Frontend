import EmptyState from '@/components/common/UI/EmptyState';
import CreateButton from '@/components/resume/CreateButton';
import ResumeItem from '@/components/resume/ResumeItem';
import { useResumeList } from '@/hooks/resume';
import { useResumeItemMenuStore } from '@/store/useResumeItemMenuStore';
import { FileText, Plus } from 'lucide-react';

const Resume = () => {
  const { data: lists, isLoading } = useResumeList();
  const { isAnyMenuOpen } = useResumeItemMenuStore();
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <p className="text-body text-gray-500 font-medium">
          나만의 전문성을 보여줄 수 있는 이력서를 작성하고 관리하세요.
        </p>
      </div>
      {isAnyMenuOpen && <div className="absolute w-full h-full bg-black z-10 opacity-0" />}
      {isLoading && <p>로딩중...</p>}
      {!isLoading && lists && lists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CreateButton
            icon="+"
            title="새 이력서 작성"
            sub="취업모아 이력서로 서류 합격률 2배 UP!"
            path="/resume/write"
          />
          {lists?.map((list) => (
            <ResumeItem key={list.id} title={list.title} id={list.id} updatedAt={list.createdAt} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-4xl border border-border-light shadow-sm">
          <EmptyState
            icon={<FileText size={48} className="text-gray-300" />}
            title="등록된 이력서가 없습니다"
            description="새로운 이력서를 작성하고 취업 성공에 한 발짝 더 다가가세요!"
            action={
              <div className="w-64 mx-auto mt-6">
                <CreateButton
                  icon={<Plus size={20} />}
                  title="첫 이력서 만들기"
                  sub="클릭하여 시작하기"
                  path="/resume/write"
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

/*
import { useResumeList } from '@/hooks/resume';
import ResumeItem from '@/components/resume/ResumeItem';
import CreateButton from '@/components/resume/CreateButton';
import EmptyState from '@/components/common/UI/EmptyState';
import Skeleton from '@/components/common/UI/Skeleton';
import { FileText, Plus } from 'lucide-react';
import type { ResumeInfo } from '@/types/ResumeFormType';

const Resume = () => {
  const { data: resumes, isLoading } = useResumeList();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <p className="text-body text-gray-500 font-medium">
          나만의 전문성을 보여줄 수 있는 이력서를 작성하고 관리하세요.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-[24px]" />
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
            <ResumeItem key={resume.id} resume={resume} />
          ))}
        </div>
      ) : (
      )}
    </div>
  );
};

export default Resume;
*/
