import { useUpdateResumeTitle } from '@/hooks/resume';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';

interface UpdateTitleFormProps {
  id: string;
  title: string;
  setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UpdateForm {
  title: string;
}

const UpdateTitleForm = ({ id, title, setIsFormOpen }: UpdateTitleFormProps) => {
  const updateResume = useUpdateResumeTitle(id);
  const formRef = useRef<HTMLFormElement | null>(null);

  const updateForm = useForm<UpdateForm>({
    defaultValues: {
      title: title,
    },
  });

  const { register, handleSubmit } = updateForm;

  const onSubmit = async (data: UpdateForm) => {
    try {
      await updateResume.mutateAsync(data.title);
      setIsFormOpen(false);
    } catch (error) {
      console.error('제목 수정 중 오류가 발생했습니다: ', error);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-[70%]">
      <input
        type="text"
        placeholder="새 제목"
        {...register('title', { required: true })}
        className="w-full bg-white border-[1.5px] border-border-light rounded-lg px-3.5 py-2.5 text-sm font-bold outline-none transition-all focus:border-btn-point focus:ring-2 focus:ring-purple-100 placeholder:text-gray-400 shadow-inner"
      />
      <button
        type="submit"
        className="mt-2 w-fit rounded-lg px-3 py-1.5 text-sm font-bold text-white bg-btn-point hover:scale-105 hover:shadow-md transition-all active:scale-95"
      >
        제목 변경
      </button>
    </form>
  );
};

export default UpdateTitleForm;
