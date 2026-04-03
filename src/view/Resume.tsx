import CreateButton from '@/components/resume/CreateButton';
import ResumeItem from '@/components/resume/ResumeItem';
import { useResumeList } from '@/hooks/resume';
import { useResumeItemMenuStore } from '@/store/useResumeItemMenuStore';

const Resume = () => {
  const { data: lists, isLoading } = useResumeList();
  const { isAnyMenuOpen } = useResumeItemMenuStore();
  return (
    <div className="w-full bg-white min-h-dvh">
      {isAnyMenuOpen && <div className="absolute w-full h-full bg-black z-10 opacity-0" />}
      <div className="w-full p-14">
        {isLoading && <p>로딩중...</p>}
        {!isLoading && (
          <div className="grid grid-cols-3 w-full gap-12 my-14">
            <CreateButton
              icon="+"
              title="새 이력서 작성"
              sub="취업모아 이력서로 서류 합격률 2배 UP!"
              path="/resume/write"
            />
            {lists?.map((list) => (
              <ResumeItem
                key={list.id}
                title={list.title}
                id={list.id}
                updatedAt={list.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume;
