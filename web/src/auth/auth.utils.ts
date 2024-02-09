import { IAuthUser, RolesEnum } from '../types/auth.types';
import axiosInstance from '../utils/axiosInstance';

export const setSession = (accessToken: string | null) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};

export const getSession = () => {
  return localStorage.getItem('accessToken');
};

export const allAccessRoles = [ RolesEnum.ADMIN, RolesEnum.USER];
export const adminAccessRoles = [ RolesEnum.ADMIN];

// We need to specify which Roles can be updated by Logged-in user
export const allowedRolesForUpdateArray = (loggedInUser?: IAuthUser): string[] => {
  return loggedInUser?.roles.includes(RolesEnum.ADMIN)
    ? [RolesEnum.ADMIN, RolesEnum.USER]
    : [ RolesEnum.USER];
};

// we need to control that Owner cannot change owner role
// Also, Admin cannot change owner role and admin role
export const isAuthorizedForUpdateRole = (loggedInUserRole: string, selectedUserRole: string) => {
  let result = true;
  if (loggedInUserRole === RolesEnum.ADMIN && selectedUserRole === RolesEnum.ADMIN) {
    result = false;
  } 

  return result;
};
