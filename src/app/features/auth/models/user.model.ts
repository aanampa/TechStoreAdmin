export interface IUsuario {
  id: number;
  email: string;
  password: string;
  nombre: string;
  role: string;
}

export interface ILoginResponse {
  success: boolean;
  message: string;
  user?: IUsuario;
  token?: string;
}
