export interface User {
  id: number;
  email: string;
  name: string;
  genre?: 'male' | 'female';
  numtel?: string;
  profilePicture?: string;
  birthdate?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  name: string;
  numtel?: string;
}

export interface AuthFormProps {
  type: 'login' | 'register';
  onSubmit: (formData: LoginFormData | RegisterFormData) => Promise<void>;
  logo: string;
}