export interface IRegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ILoginDto {
  userName: string;
  password: string;
}

export interface IUpdateRoleDto {
  userName: string;
  newRole: string;
}

export interface IAuthUser {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  roles: string[];
}

export interface IServiceResponse {
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export interface ILoginResponseDto {
  newToken: string;
  userInfo: IAuthUser;
  success?: boolean;
  message?: string;
}

export interface IAuthContextState {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  user?: IAuthUser;
}

export enum IAuthContextActionTypes {
  INITIAL = 'INITIAL',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

export interface IAuthContextAction {
  type: IAuthContextActionTypes;
  payload?: IAuthUser;
}

export interface IAuthContext {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  user?: IAuthUser;
  login: (userName: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

export enum RolesEnum {
  ADMIN = 'Admin',
  USER = 'User',
}
