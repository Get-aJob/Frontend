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
    /* ✨ Layout에서 p-8과 애니메이션을 담당하므로 중복 속성 제거 */
    <div className="flex flex-col gap-8">
      {/* 상단 타이틀 섹션: 다른 페이지(지원 현황, 공고 등)와 높이를 맞춤 */}
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
          {/* 새 이력서 작성 버튼 카드 */}
          <CreateButton
            icon={<Plus size={24} />}
            title="새 이력서 작성"
            sub="새로운 이력서를 생성합니다"
            path="/resume/new"
          />
          {/* 이력서 리스트 */}
          {resumes.map((resume: ResumeInfo) => (
            <ResumeItem key={resume.id} resume={resume} />
          ))}
        </div>
      ) : (
        /* 데이터가 없을 때도 다른 카드들과 톤을 맞춘 디자인 */
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[32px] border border-border-light shadow-sm">
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
