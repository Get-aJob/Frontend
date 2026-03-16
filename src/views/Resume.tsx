import Topbar from '@/components/common/Topbar';
import CreateButton from '@/components/resume/CreateButton';
import ResumeItem from '@/components/resume/ResumeItem';

const Resume = () => {
  return (
    <div className="w-full relative">
      <Topbar title="이력서 관리" badgeText="Resume" showSearch={true} />
      <div className="w-full bg-white h-dvh overflow-scroll">
        <div className="w-full p-14">
          <h1 className="text-3xl">이력서 목록</h1>
          <div className="grid grid-cols-3 w-full gap-12 my-5">
            <CreateButton
              icon="+"
              title="새 이력서 작성"
              sub="취업모아 이력서로 서류 합격률 2배 UP!"
            />
            <ResumeItem title="unknown" memo="unknown" updatedAt="26.03.11" />
            <ResumeItem title="unknown" updatedAt="" />
            <div className="w-full h-75 bg-blue-500 rounded-2xl"></div>
            <div className="w-full h-75 bg-blue-500 rounded-2xl"></div>
            <div className="w-full h-75 bg-blue-500 rounded-2xl"></div>
            <div className="w-full h-75 bg-blue-500 rounded-2xl"></div>
            <div className="w-full h-75 bg-blue-500 rounded-2xl"></div>
            <div className="w-full h-75 bg-blue-500 rounded-2xl"></div>
            <div className="w-full h-75 bg-blue-500 rounded-2xl"></div>
            <div className="w-full h-75 bg-blue-500 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;
