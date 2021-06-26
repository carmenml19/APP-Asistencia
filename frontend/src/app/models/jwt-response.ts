export interface UsuarioBD {

    dataUser: DataUser;
}

export interface DataUser {

  email: string;
  password?: string;
  accessToken: string;
  expiresIn: string;
  facultad: string;
}
