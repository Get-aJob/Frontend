import {
  createResume,
  deleteResume,
  getAllResume,
  getResumeById,
  updateResume,
} from '@/api/ResumeForm';
import type { GetResumeById, ResumeFormData, ResumeInfo } from '@/types/ResumeFormType';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useSaveResume = (resumeId: string | undefined) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: ResumeFormData) => {
      if (!resumeId) {
        const response = await createResume(formData);
        return response;
      } else {
        const response = await updateResume(resumeId, formData);
        return response;
      }
    },
    onSuccess: () => {
      alert('저장 성공!');
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
    onError: (error) => {
      console.error('저장 실패:', error);
      alert('저장 중 오류가 발생했습니다.');
    },
  });
};

export const useResumeList = () => {
  return useQuery<ResumeInfo[], Error>({
    queryKey: ['resumes', 'list'],
    queryFn: getAllResume,
    placeholderData: [],
  });
};

export const useGetResume = (resumeId: string | undefined) => {
  return useQuery<GetResumeById, Error>({
    queryKey: ['resumes', resumeId],
    queryFn: async () => {
      const resume = await getResumeById(resumeId!);
      return resume;
    },
    enabled: !!resumeId,
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (resumeId: string) => {
      const response = await deleteResume(resumeId);
      return response;
    },
    onSuccess: () => {
      alert('삭제 완료');
      queryClient.invalidateQueries({ queryKey: ['resumes', 'list'] });
    },
    onError: (error) => {
      console.error('삭제 실패:', error);
      alert('삭제 중 오류가 발생했습니다.');
    },
  });

  return { mutate };
};
