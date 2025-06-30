import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { authApi } from '../services/api';

interface AuthContextType extends AuthState {
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, identifier: string, password: string, verificationType: 'email' | 'phone') => Promise<void>;
  verifyOTP: (identifier: string, otp: string, verificationType: 'email' | 'phone') => Promise<void>;
  resendOTP: (identifier: string, verificationType: 'email' | 'phone') => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  pendingVerification: { identifier: string; verificationType: 'email' | 'phone' } | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_PENDING_VERIFICATION'; payload: { identifier: string; verificationType: 'email' | 'phone' } }
  | { type: 'CLEAR_PENDING_VERIFICATION' };

interface AuthProviderState extends AuthState {
  loading: boolean;
  error: string | null;
  pendingVerification: { identifier: string; verificationType: 'email' | 'phone' } | null;
}

const initialState: AuthProviderState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
  pendingVerification: null,
};

function authReducer(state: AuthProviderState, action: AuthAction): AuthProviderState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
        pendingVerification: null,
      };
    case 'LOGIN_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        pendingVerification: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_PENDING_VERIFICATION':
      return { ...state, pendingVerification: action.payload, loading: false };
    case 'CLEAR_PENDING_VERIFICATION':
      return { ...state, pendingVerification: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (identifier: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const { user, token } = await authApi.login(identifier, password);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: (error as Error).message });
    }
  };

  const register = async (username: string, identifier: string, password: string, verificationType: 'email' | 'phone') => {
    dispatch({ type: 'LOGIN_START' });
    try {
      await authApi.register(username, identifier, password, verificationType);
      dispatch({ type: 'SET_PENDING_VERIFICATION', payload: { identifier, verificationType } });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: (error as Error).message });
    }
  };

  const verifyOTP = async (identifier: string, otp: string, verificationType: 'email' | 'phone') => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const { user, token } = await authApi.verifyOTP(identifier, otp, verificationType);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: (error as Error).message });
    }
  };

  const resendOTP = async (identifier: string, verificationType: 'email' | 'phone') => {
    dispatch({ type: 'LOGIN_START' });
    try {
      await authApi.resendOTP(identifier, verificationType);
      dispatch({ type: 'CLEAR_ERROR' });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: (error as Error).message });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        verifyOTP,
        resendOTP,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}