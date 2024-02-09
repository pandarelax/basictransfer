import { PATH_DASHBOARD, PATH_PUBLIC } from '../routes/paths.ts';

// URLS
export const HOST_API_KEY = 'http://localhost:5137/api';
export const REGISTER_URL = '/Auth/register';
export const LOGIN_URL = '/Auth/login';
export const ME_URL = '/Auth/me';
export const USERS_LIST_URL = '/User';
export const UPDATE_ROLE_URL = '/Auth/assign-role';
export const USERNAMES_LIST_URL = '/Auth/usernames';
export const DEPARTMENTS_LIST_URL = '/Department';

// Auth Routes
export const PATH_AFTER_REGISTER = PATH_PUBLIC.login;
export const PATH_AFTER_LOGIN = PATH_DASHBOARD.dashboard;
export const PATH_AFTER_LOGOUT = PATH_PUBLIC.home;
