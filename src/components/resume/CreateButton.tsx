import React from 'react';
import { Link } from 'react-router-dom';

interface CreateButtonProps {
  icon: React.ReactNode;
  title: string;
  sub: string;
  path: string;
}

const CreateButton = ({ icon, title, sub, path }: CreateButtonProps) => {
  return (
    <Link to={path} className="block w-full h-full">
      <div className="group w-full h-full min-h-48 flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl hover:border-btn-point hover:bg-indigo-50 transition-all duration-300 cursor-pointer active:scale-[0.98]">
        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-400 group-hover:text-btn-point group-hover:scale-110 transition-transform duration-300 mb-4">
          {icon}
        </div>
        <h3 className="text-subtitle font-bold text-gray-700 group-hover:text-btn-point transition-colors">
          {title}
        </h3>
        <p className="text-xs text-gray-500 mt-2 font-medium">{sub}</p>
      </div>
    </Link>
  );
};

export default CreateButton;
