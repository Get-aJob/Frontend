export interface LoginField {
  email: string;
  password: string;
}

// 회원가입 시 입력 데이터
export interface JoinField extends LoginField {
  name: string;
  profileImage?: File | null;
}
