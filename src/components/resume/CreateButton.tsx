import { Link } from 'react-router-dom';

interface CreateButtonProps {
  icon?: string | React.ReactNode;
  title: string;
  sub: string;
  path: string;
}

const CreateButton = ({ icon, title, sub, path }: CreateButtonProps) => {
  return (
    <Link to={path}>
      <div className="w-full h-64 xl:h-75 relative bg-black/5 border border-border-light rounded-3xl p-6 transition-all hover:shadow-md cursor-pointer hover:border-2 hover:border-dashed hover:border-outline-point">
        <div className="flex w-full h-full items-center justify-center relative">
          <div className="text-center">
            <h1 className="text-6xl text-black/40 justify-center items-center">{icon}</h1>
            <h1 className="text-black/40">{title}</h1>
          </div>
          <div className="absolute flex items-center justify-center left-0 bottom-0 w-full h-1/4">
            <p className="text-sm text-black/40">{sub}</p>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full white border-2 border-black/10 rounded-2xl"></div>
      </div>
    </Link>
  );
};

export default CreateButton;
