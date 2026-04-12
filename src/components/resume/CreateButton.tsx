import { Link } from 'react-router-dom';

interface CreateButtonProps {
  icon?: string | React.ReactNode;
  title: string;
  sub?: string;
  path: string;
}

const CreateButton = ({ icon, title, sub, path }: CreateButtonProps) => {
  return (
    <Link to={path}>
      <div className="w-full h-44 xl:h-55 relative bg-white border border-border-light rounded-3xl p-6 transition-all hover:border-btn-point hover:shadow-md cursor-pointer group">
        <div className="flex w-full h-full items-center justify-center relative">
          <div className="text-center">
            <h1 className="text-5xl font-black text-gray-200 group-hover:text-btn-point transition-colors justify-center items-center">
              {icon}
            </h1>
            <p className="mt-2 text-sm font-bold text-gray-400 group-hover:text-btn-point transition-colors">
              {title}
            </p>
          </div>
          <div className="absolute items-center justify-center left-0 bottom-0 w-full hidden lg:flex">
            <p className="text-xs font-semibold text-gray-300">{sub}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CreateButton;
