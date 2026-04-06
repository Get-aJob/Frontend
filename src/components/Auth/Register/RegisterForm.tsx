import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Camera } from 'lucide-react';
import type { JoinField } from '@/types/Auth';
import Input from '@/components/common/UI/Input';
import Button from '@/components/common/UI/Button';

interface RegisterFormProps {
  onSwitchLogin: () => void;
  onSubmit: (data: JoinField) => void;
  isLoading: boolean;
  errorMsg: string;
}

interface RegisterFormData extends JoinField {
  passwordConfirm: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSwitchLogin,
  onSubmit,
  isLoading,
  errorMsg,
}) => {
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4 w-85 mx-auto">
      {errorMsg && (
        <div className="p-3 mb-1 rounded-lg bg-red-50 text-status-error text-sm font-bold text-center border border-red-100">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-col items-center gap-2 mb-2">
        <label className="cursor-pointer relative group">
          <div className="w-20 h-20 rounded-full bg-bg-view border border-border-light flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-btn-point">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <Camera size={20} className="text-gray-400 mb-1" />
                <span className="text-body text-gray-400">사진 추가</span>
              </>
            )}
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </label>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700 ml-1">이름</label>
        <Input
          type="text"
          placeholder="홍길동"
          className={errors.name ? 'border-status-error focus:ring-red-100' : ''}
          {...register('name', { required: '이름을 입력해주세요.' })}
        />
        {errors.name && (
          <span className="text-status-error text-body ml-1">{errors.name.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700 ml-1">이메일</label>
        <Input
          type="email"
          placeholder="example@email.com"
          className={errors.email ? 'border-status-error focus:ring-red-100' : ''}
          {...register('email', {
            required: '이메일을 입력해주세요.',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: '올바른 이메일 형식이 아닙니다.',
            },
          })}
        />
        {errors.email && (
          <span className="text-status-error text-body ml-1">{errors.email.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700 ml-1">비밀번호</label>
        <Input
          type="password"
          placeholder="8자 이상 입력해주세요"
          className={errors.password ? 'border-status-error focus:ring-red-100' : ''}
          {...register('password', {
            required: '비밀번호를 입력해주세요.',
            minLength: { value: 8, message: '비밀번호는 8자 이상이어야 합니다.' },
          })}
        />
        {errors.password && (
          <span className="text-status-error text-body ml-1">{errors.password.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700 ml-1">비밀번호 확인</label>
        <Input
          type="password"
          placeholder="비밀번호를 한 번 더 입력해주세요"
          className={errors.passwordConfirm ? 'border-status-error focus:ring-red-100' : ''}
          {...register('passwordConfirm', {
            required: '비밀번호 확인이 필요합니다.',
            deps: ['password'],
            validate: (value) => value === getValues('password') || '비밀번호가 일치하지 않습니다.',
          })}
        />
        {errors.passwordConfirm && (
          <span className="text-status-error text-body ml-1">{errors.passwordConfirm.message}</span>
        )}
      </div>

      <Button type="submit" className="w-full mt-2 py-3" isLoading={isLoading}>
        {isLoading ? '회원가입 진행 중...' : '회원가입 시작하기'}
      </Button>

      <div className="mt-4 text-center text-sm text-gray-500">
        이미 계정이 있으신가요?
        <button
          type="button"
          onClick={onSwitchLogin}
          className="font-bold text-btn-point ml-1.5 hover:underline cursor-pointer"
        >
          로그인
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
