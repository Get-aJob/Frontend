export interface LoginField {
  email: string;
  password: string;
}
export interface JoinField extends LoginField {
  name: string;
  profileImage?: File | null;
}
