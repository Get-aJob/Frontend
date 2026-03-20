import { PATH } from '@/router/Path';
import type { ResumeFormInputs } from '@/types/ResumeFormType';
import { useFormContext, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const ResumeFormTopbar = () => {
  const { register, handleSubmit } = useFormContext<ResumeFormInputs>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ResumeFormInputs> = (data) => {
    alert(JSON.stringify(data, null, 2));
  };
  return (
    <aside className="bg-white">
      <div className="w-full min-h-20 flex justify-between items-center gap-10">
        <button
          type="button"
          onClick={() => {
            navigate(PATH.RESUME);
          }}
          className="flex p-2 mx-5 rounded-xl hover:bg-black/5"
        >
          <ChevronLeft size={18} className="mt-0.5" />
          <p>이전 페이지</p>
        </button>
        <input
          {...register('title')}
          type="text"
          placeholder="제목을 입력하세요."
          className="p-3 rounded-xl shadow-inner"
        />
        <button
          type="button"
          onClick={handleSubmit(onSubmit)}
          className="py-2 px-3 border mx-5 rounded-xl text-white bg-blue-400 hover:bg-blue-600"
        >
          작성 완료
        </button>
      </div>
      <div className="w-full h-px bg-black/5" />
    </aside>
  );
};

export default ResumeFormTopbar;
