import { Link } from 'react-router-dom';

interface CreateButtonProps {
  icon: string;
  title: string;
  sub: string;
  path: string;
}

const CreateButton = ({ icon, title, sub, path }: CreateButtonProps) => {
  return (
    <Link to={path}>
      <div className="w-full h-75 relative">
        <div className="flex w-full h-full items-center justify-center relative">
          <div className="text-center">
            <h1 className="text-6xl text-gray-400">{icon}</h1>
            <h1 className="text-gray-400">{title}</h1>
          </div>
          <div className="absolute flex items-center justify-center left-0 bottom-0 w-full h-1/4">
            <p className="text-sm text-gray-400">{sub}</p>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-black/5 border-2 border-black/5 rounded-2xl hover:scale-[101%] hover:bg-black/10"></div>
      </div>
    </Link>
  );
};

export default CreateButton;
