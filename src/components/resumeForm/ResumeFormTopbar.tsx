import { PATH } from '@/router/Path';
import type { ResumeFormInputs } from '@/types/ResumeFormType';
import { useFormContext, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, LoaderCircle } from 'lucide-react';
import ResumeDownloadButton from './ResumeDownloadButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitApi } from '@/api/ResumeForm';

const ResumeFormTopbar = () => {
  const { register, handleSubmit, watch } = useFormContext<ResumeFormInputs>();
  const navigate = useNavigate();
  const formData = watch();

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: ResumeFormInputs) => {
      const response = submitApi(formData);
      return response;
    },
    onSuccess: (data) => {
      alert(JSON.stringify(data));
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
    onError: (error) => {
      console.error('저장 실패:', error);
      alert('저장 중 오류가 발생했습니다.');
    },
  });

  const onSubmit: SubmitHandler<ResumeFormInputs> = (data) => {
    //alert(JSON.stringify(data, null, 2));
    mutate(data);
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
        <div className="h-full flex w-fit">
          <ResumeDownloadButton
            data={formData}
            className="py-2 px-3 rounded-xl hover:bg-black/10"
          />
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="py-2 px-3 border mx-5 rounded-xl text-white bg-blue-400 hover:bg-blue-600"
          >
            {isPending ? <LoaderCircle className="animate-spin" /> : '작성 완료'}
          </button>
        </div>
      </div>
      <div className="w-full h-px bg-black/5" />
    </aside>
  );
};

export default ResumeFormTopbar;
