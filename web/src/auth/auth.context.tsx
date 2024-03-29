import { ReactNode, createContext, useCallback, useEffect, useReducer } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  IAuthContext,
  IAuthContextAction,
  IAuthContextActionTypes,
  IAuthContextState,
  ILoginResponseDto,
} from '../types/auth.types';
import axiosInstance from '../utils/axiosInstance';
import {
  LOGIN_URL,
  PATH_AFTER_LOGIN,
  PATH_AFTER_LOGOUT,
  PATH_AFTER_REGISTER,
  REGISTER_URL
} from '../utils/globalConfig';
import { getSession, setSession } from './auth.utils';

// We need a reducer function for useReducer hook
const authReducer = (state: IAuthContextState, action: IAuthContextAction) => {
  if (action.type === IAuthContextActionTypes.LOGIN) {
    return {
      ...state,
      isAuthenticated: true,
      isAuthLoading: false,
      user: action.payload,
    };
  }
  if (action.type === IAuthContextActionTypes.LOGOUT) {
    return {
      ...state,
      isAuthenticated: false,
      isAuthLoading: false,
      user: undefined,
    };
  }
  return state;
};

// We need an initial state object for useReducer hook
const initialAuthState: IAuthContextState = {
  isAuthenticated: false,
  isAuthLoading: true,
  user: undefined,
};

// We create our context here and export it
export const AuthContext = createContext<IAuthContext | null>(null);

// We need an interface for our context props
interface IProps {
  children: ReactNode;
}

// We create a component to manage all auth functionalities and export it and use it
const AuthContextProvider = ({ children }: IProps) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const navigate = useNavigate();

  // Initialize Method
  const initializeAuthContext = useCallback(async () => {
    try {
      const { token, userInfo } = getSession();
      if (token) {
        if (userInfo) {
          setSession(token, userInfo);
        } else {
          setSession(token);
        }
        dispatch({
          type: IAuthContextActionTypes.LOGIN,
          payload: userInfo,
        });
      } else {
        setSession(null);
        dispatch({
          type: IAuthContextActionTypes.LOGOUT,
        });
      }
    } catch (error) {
      setSession(null);
      dispatch({
        type: IAuthContextActionTypes.LOGOUT,
      });
    }
  }, []);

  // In start of Application, We call initializeAuthContext to be sure about authentication status
  useEffect(() => {
    console.log('AuthContext Initialization start');
    initializeAuthContext()
      .then(() => console.log('initializeAuthContext was successfull'))
      .catch((error) => console.log(error));
  }, []);
  
  // Register Method
  const register = useCallback(
    async (firstName: string, lastName: string, email: string, password: string) => {
      const response = await axiosInstance.post(REGISTER_URL, {
        firstName,
        lastName,
        email,
        password,
      });
      console.log('Register Result:', response);
      toast.success('Register Was Successfull. Please Login.');
      navigate(PATH_AFTER_REGISTER);
    },
    []
  );
  
  // Login Method
  const login = useCallback(async (email: string, password: string) => {
    const response = await axiosInstance.post<ILoginResponseDto>(LOGIN_URL, {
      email,
      password,
    });
    toast.success('Login Was Successful');
    // In response, we receive jwt token and user data
    const { newToken, userInfo } = response.data;
    setSession(newToken, userInfo);
    dispatch({
      type: IAuthContextActionTypes.LOGIN,
      payload: userInfo,
    });
    navigate(PATH_AFTER_LOGIN);
  }, []);
  
  // Logout Method
  const logout = useCallback(() => {
    setSession(null);
    dispatch({
      type: IAuthContextActionTypes.LOGOUT,
    });
    navigate(PATH_AFTER_LOGOUT);
  }, []);
  
  // We create an object for values of context provider
  // This will keep our codes more readable
  const valuesObject = {
    isAuthenticated: state.isAuthenticated,
    isAuthLoading: state.isAuthLoading,
    user: state.user,
    register,
    login,
    logout,
  };
  
  return <AuthContext.Provider value={valuesObject}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
