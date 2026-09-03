import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api from '../services/api';
import { setLanguage } from '../i18n';

interface User {
  id: string;
  name: string;
  mobileNumber: string;
  role: string;
  preferredLanguage: string;
  isOnboarded: boolean;
  district?: string;
  state?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (mobileNumber: string, otp: string) => Promise<User | null>;
  signup: (data: any) => Promise<User | null>;
  pinLogin: (mobileNumber: string, pin: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  requestOtp: (mobileNumber: string, purpose?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('growsmart_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists and try to load user
    const token = localStorage.getItem('growsmart_access_token');
    if (token) {
      api.getMe()
        .then(({ user: u }) => {
          setUser(u);
          localStorage.setItem('growsmart_user', JSON.stringify(u));
          setLanguage(u.preferredLanguage || 'en');
        })
        .catch(() => {
          localStorage.removeItem('growsmart_access_token');
          localStorage.removeItem('growsmart_refresh_token');
          localStorage.removeItem('growsmart_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const requestOtp = useCallback(async (mobileNumber: string, purpose: string = 'LOGIN') => {
    await api.requestOtp(mobileNumber, purpose);
  }, []);

  const login = useCallback(async (mobileNumber: string, otp: string): Promise<User | null> => {
    const data = await api.verifyOtp(mobileNumber, otp, 'LOGIN');
    if (data.user) {
      setUser(data.user);
      localStorage.setItem('growsmart_user', JSON.stringify(data.user));
      setLanguage(data.user.preferredLanguage || 'en');
      return data.user;
    }
    return null;
  }, []);

  const signup = useCallback(async (data: any): Promise<User | null> => {
    // First verify OTP
    await api.verifyOtp(data.mobileNumber, data.otp, 'SIGNUP');
    // Then create account
    const result = await api.signup(data);
    setUser(result.user);
    localStorage.setItem('growsmart_user', JSON.stringify(result.user));
    setLanguage(result.user.preferredLanguage || 'en');
    return result.user;
  }, []);

  const pinLogin = useCallback(async (mobileNumber: string, pin: string) => {
    const data = await api.pinLogin(mobileNumber, pin);
    setUser(data.user);
    localStorage.setItem('growsmart_user', JSON.stringify(data.user));
    setLanguage(data.user.preferredLanguage || 'en');
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
    localStorage.removeItem('growsmart_user');
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('growsmart_user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, pinLogin, logout, updateUser, requestOtp }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
