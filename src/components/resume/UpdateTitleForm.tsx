import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Check, X } from 'lucide-react';
import { useUpdateResumeTitle } from '@/hooks/resume';
import Input from '@/components/common/UI/Input';
import Button from '@/components/common/UI/Button';

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

  const { register, handleSubmit } = useForm<UpdateForm>({
    defaultValues: { title: title },
  });

  const onSubmit = async (data: UpdateForm) => {
    if (!data.title.trim() || data.title === title) {
      setIsFormOpen(false);
      return;
    }
    try {
      await updateResume.mutateAsync(data.title);
      setIsFormOpen(false);
    } catch (error) {
      console.error('제목 수정 중 오류가 발생했습니다: ', error);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center gap-1.5 w-full mb-2"
      onClick={(e) => e.stopPropagation()}
    >
      <Input
        type="text"
        placeholder="새 제목 입력"
        {...register('title', { required: true })}
        className="flex-1 py-1 px-2.5 min-h-4xl text-sm font-bold bg-white focus:ring-1"
        autoFocus
      />
      <div className="flex gap-1 shrink-0">
        <Button
          type="submit"
          size="sm"
          className="px-2 py-1 min-h-4xl"
          isLoading={updateResume.isPending}
        >
          <Check size={14} strokeWidth={3} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="px-2 py-1 min-h-[32px] bg-gray-100 text-gray-500 hover:bg-gray-200"
          onClick={() => setIsFormOpen(false)}
          disabled={updateResume.isPending}
        >
          <X size={14} strokeWidth={3} />
        </Button>
      </div>
    </form>
  );
};

export default UpdateTitleForm;
