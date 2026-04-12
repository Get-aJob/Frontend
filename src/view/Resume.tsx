import EmptyState from '@/components/common/UI/EmptyState';
import CreateButton from '@/components/resume/CreateButton';
import ResumeItem from '@/components/resume/ResumeItem';
import PortFolioPreview from '@/components/resumeForm/PortFolioPreview';
import { useResumeList } from '@/hooks/resume';
import { usePreviewStore } from '@/store/usePdfPreviewStore';
import { useResumeItemMenuStore } from '@/store/useResumeItemMenuStore';
import { FileText } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

const Resume = () => {
  const { data: lists, isLoading } = useResumeList();
  const isAnyMenuOpen = useResumeItemMenuStore((state) => state.isAnyMenuOpen);
  const { isOpen, name } = usePreviewStore(
    useShallow((state) => ({ isOpen: state.isOpen, name: state.name })),
  );
  return (
    <div className="flex flex-col gap-8 relative">
      {isOpen && <PortFolioPreview name={name} />}
      <div className="flex flex-col gap-1">
        <p className="text-body text-gray-500 font-medium">
          나만의 전문성을 보여줄 수 있는 이력서를 작성하고 관리하세요.
        </p>
      </div>
      {isAnyMenuOpen && <div className="absolute w-full h-full bg-black z-10 opacity-0" />}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-64 xl:h-75 bg-white animate-pulse rounded-3xl border border-border-light shadow-sm"
            />
          ))}
        </div>
      )}
      {!isLoading && lists && lists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
        !isLoading && (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-4xl border border-border-light shadow-sm">
            <EmptyState
              icon={<FileText size={48} className="text-gray-300" />}
              title="등록된 이력서가 없습니다"
              description="새로운 이력서를 작성하고 취업 성공에 한 발짝 더 다가가세요!"
              action={
                <div className="w-120 h-30">
                  <CreateButton
                    icon="+"
                    title="첫 이력서 만들기"
                    sub="클릭하여 시작하기"
                    path="/resume/write"
                  />
                </div>
              }
              className="h-120"
            />
          </div>
        )
      )}
    </div>
  );
};

export default Resume;
