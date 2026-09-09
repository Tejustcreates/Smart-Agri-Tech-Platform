import { useCallback, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export type AuthMode = 'login' | 'signup';
export type AuthStep = 'mobile' | 'otp' | 'signup';

interface SignupValues {
  name: string;
  preferredLanguage: string;
}

/**
 * Shared mobile-number -> OTP -> (signup details) step machine.
 * Used by both the AuthModal (in-page dialog) and AuthPage (full page) so the
 * validation/error/loading logic only exists once instead of two divergent copies.
 */
export function useAuthFlow(initialMode: AuthMode = 'login') {
  const { login, requestOtp, updateUser } = useAuth();
  const [mode, setModeState] = useState<AuthMode>(initialMode);
  const [step, setStep] = useState<AuthStep>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setMode = useCallback((m: AuthMode) => {
    setModeState(m);
    setStep('mobile');
    setError('');
  }, []);

  const reset = useCallback((m: AuthMode = 'login') => {
    setModeState(m);
    setStep('mobile');
    setMobileNumber('');
    setOtp('');
    setError('');
  }, []);

  const sendOtp = useCallback(async (mobile: string) => {
    setError('');
    setLoading(true);
    try {
      await requestOtp(mobile, mode === 'login' ? 'LOGIN' : 'SIGNUP');
      setMobileNumber(mobile);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mode, requestOtp]);

  const verifyOtp = useCallback(async (otpValue: string) => {
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const user = await login(mobileNumber, otpValue);
        if (!user) {
          setError('Verification failed. Please try again.');
          return null;
        }
        return user;
      }
      await api.verifyOtp(mobileNumber, otpValue, 'SIGNUP');
      setOtp(otpValue);
      setStep('signup');
      return null;
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mode, mobileNumber, login]);

  const changeNumber = useCallback(() => {
    setStep('mobile');
    setOtp('');
  }, []);

  const createAccount = useCallback(async (values: SignupValues) => {
    setError('');
    setLoading(true);
    try {
      const result = await api.signup({ mobileNumber, otp, name: values.name, preferredLanguage: values.preferredLanguage });
      // Push the freshly-created account into AuthContext so the rest of the
      // app (Header, ProtectedRoute, etc.) sees the logged-in state immediately
      // instead of only landing in localStorage until the next reload.
      updateUser(result.user);
      return result.user;
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mobileNumber, otp, updateUser]);

  return {
    mode, step, mobileNumber, loading, error,
    setMode, reset, sendOtp, verifyOtp, changeNumber, createAccount,
  };
}
