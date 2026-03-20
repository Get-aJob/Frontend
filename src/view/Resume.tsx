import CreateButton from '@/components/resume/CreateButton';
import ResumeItem from '@/components/resume/ResumeItem';

const Resume = () => {
  return (
    <div className="w-full bg-white min-h-dvh">
      <div className="w-full p-14">
        <h1 className="text-3xl">이력서 목록</h1>
        <div className="grid grid-cols-3 w-full gap-12 my-14">
          <CreateButton
            icon="+"
            title="새 이력서 작성"
            sub="취업모아 이력서로 서류 합격률 2배 UP!"
            path="/resume/write"
          />
          <ResumeItem title="unknown" memo="unknown" updatedAt="26.03.11" />
          <ResumeItem title="unknown" updatedAt="" />
          <ResumeItem title="unknown" updatedAt="" />
        </div>
      </div>
    </div>
  );
};

export default Resume;
