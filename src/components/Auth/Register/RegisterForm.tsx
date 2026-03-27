import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { JoinField } from '@/types/Auth';

interface RegisterFormProps {
  onSwitchLogin: () => void;
  onSubmit: (data: JoinField) => void;
}

interface RegisterFormData extends JoinField {
  passwordConfirm: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchLogin, onSubmit }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    mode: 'onChange',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('profileImage', file);
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = ({ name, email, password, profileImage }: RegisterFormData) => {
    onSubmit({ name, email, password, profileImage });
  };

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      {/* 프로필 이미지 업로드 영역 */}
      <div className="flex flex-col items-center gap-2 mb-2">
        <label className="cursor-pointer relative group">
          <div className="w-20 h-20 rounded-full bg-[#f9fafb] border border-[#e8eaf0] flex items-center justify-center overflow-hidden transition-all group-hover:border-[#4f46e5]">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[12px] text-[#9ca3af]">사진 추가</span>
            )}
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-[#4b5563] ml-1">이름</label>
        <input
          type="text"
          placeholder="홍길동"
          className={`w-full p-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-[#e8eaf0]'} bg-[#f9fafb] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all`}
          {...register('name', { required: '이름을 입력해주세요.' })}
        />
        {errors.name && (
          <span className="text-red-500 text-[11px] ml-1">{errors.name.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-[#4b5563] ml-1">이메일</label>
        <input
          type="email"
          placeholder="example@email.com"
          className={`w-full p-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-[#e8eaf0]'} bg-[#f9fafb] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all`}
          {...register('email', {
            required: '이메일을 입력해주세요.',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: '올바른 이메일 형식이 아닙니다.',
            },
          })}
        />
        {errors.email && (
          <span className="text-red-500 text-[11px] ml-1">{errors.email.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-[#4b5563] ml-1">비밀번호</label>
        <input
          type="password"
          placeholder="8자 이상 입력해주세요"
          className={`w-full p-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-[#e8eaf0]'} bg-[#f9fafb] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all`}
          {...register('password', {
            required: '비밀번호를 입력해주세요.',
            minLength: { value: 8, message: '비밀번호는 8자 이상이어야 합니다.' },
          })}
        />
        {errors.password && (
          <span className="text-red-500 text-[11px] ml-1">{errors.password.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-medium text-[#4b5563] ml-1">비밀번호 확인</label>
        <input
          type="password"
          placeholder="비밀번호를 한 번 더 입력해주세요"
          className={`w-full p-3 rounded-xl border ${errors.passwordConfirm ? 'border-red-500' : 'border-[#e8eaf0]'} bg-[#f9fafb] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all`}
          {...register('passwordConfirm', {
            required: '비밀번호 확인이 필요합니다.',
            deps: ['password'],
            validate: (value) => value === getValues('password') || '비밀번호가 일치하지 않습니다.',
          })}
        />
        {errors.passwordConfirm && (
          <span className="text-red-500 text-[11px] ml-1">{errors.passwordConfirm.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="mt-2 w-full p-3.5 rounded-xl bg-linear-to-br from-[#4f46e5] to-[#8b5cf6] text-white text-[14px] font-bold shadow-[0_4px_12px_rgba(79,70,229,0.2)] hover:opacity-95 transition-opacity active:scale-[0.98] cursor-pointer"
      >
        회원가입 시작하기
      </button>

      <div className="mt-4 text-center text-[13px] text-[#9ca3af]">
        이미 계정이 있으신가요?
        <button
          type="button"
          onClick={onSwitchLogin}
          className="font-bold text-[#4f46e5] ml-1.5 hover:underline cursor-pointer"
        >
          로그인
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
