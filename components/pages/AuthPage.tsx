import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';

type AuthStep = 'mobile' | 'otp' | 'signup';

export default function AuthPage() {
  const { t } = useTranslation();
  const { login, signup, requestOtp } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<AuthStep>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [language, setLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate mobile number (Indian format)
    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setLoading(true);
    try {
      await requestOtp(mobileNumber);
      setOtpSent(true);
      setStep('otp');
      if (mode === 'signup') setStep('signup');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const apiModule = await import('../../services/api');
      const apiClient = apiModule.default;
      const data = await apiClient.verifyOtp(mobileNumber, otp, mode === 'login' ? 'LOGIN' : 'SIGNUP');

      if (mode === 'login' && data.user) {
        // Login success
        const userData = data.user;
        localStorage.setItem('growsmart_user', JSON.stringify(userData));
        navigate(userData.isOnboarded ? '/dashboard' : '/onboarding');
      } else if (mode === 'signup') {
        // OTP verified, now show signup form
        setStep('signup');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 2) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);
    try {
      const { api } = await import('../../services/api');
      const result = await api.signup({
        mobileNumber,
        otp,
        name,
        preferredLanguage: language,
      });
      localStorage.setItem('growsmart_user', JSON.stringify(result.user));
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-green-900 to-emerald-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
              <path d="M12 2C7 4 4 8 4 13c0 4.42 3.58 8 8 8s8-3.58 8-8c0-5-3-9-8-11z" fill="currentColor" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white">GROW<span className="text-emerald-400">SMART</span></span>
        </div>
        <LanguageSwitcher compact />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => { setMode('login'); setStep('mobile'); setError(''); }}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${mode === 'login' ? 'text-agri-green border-b-2 border-agri-green' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Login
              </button>
              <button
                onClick={() => { setMode('signup'); setStep('mobile'); setError(''); }}
                className={`flex-1 py-4 text-sm font-semibold transition-colors ${mode === 'signup' ? 'text-agri-green border-b-2 border-agri-green' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Sign Up
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                {mode === 'login' ? 'Login with your mobile number' : 'Register using your mobile number'}
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                  {error}
                </div>
              )}

              {step === 'mobile' && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-3 bg-gray-100 rounded-l-xl text-gray-600 text-sm font-semibold border-2 border-r-0 border-gray-200">
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="10-digit mobile number"
                        className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-r-xl text-gray-800 text-base placeholder-gray-400 focus:outline-none focus:border-agri-green transition-colors"
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || mobileNumber.length !== 10}
                    className="w-full py-4 bg-agri-green hover:bg-agri-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </form>
              )}

              {step === 'otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="6-digit OTP"
                      className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 text-2xl font-bold tracking-[0.3em] text-center placeholder:font-normal placeholder:text-sm placeholder:text-gray-400 focus:outline-none focus:border-agri-green transition-colors"
                      autoFocus
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      OTP sent to +91 {mobileNumber}{' '}
                      <button
                        type="button"
                        onClick={() => { setStep('mobile'); setOtp(''); }}
                        className="text-agri-green font-medium hover:underline"
                      >
                        Change
                      </button>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full py-4 bg-agri-green hover:bg-agri-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setStep('mobile'); setOtp(''); }}
                    className="w-full text-center text-sm text-agri-green font-medium hover:underline"
                  >
                    Resend OTP
                  </button>
                </form>
              )}

              {step === 'signup' && (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 text-base placeholder-gray-400 focus:outline-none focus:border-agri-green transition-colors"
                      autoFocus
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Language
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { code: 'en', label: 'English' },
                        { code: 'hi', label: 'हिन्दी' },
                        { code: 'mr', label: 'मराठी' },
                      ].map((l) => (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => setLang(l.code)}
                          className={`py-3 rounded-xl text-sm font-medium border-2 transition-colors ${
                            language === l.code
                              ? 'border-agri-green bg-green-50 text-agri-green'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || name.trim().length < 2}
                    className="w-full py-4 bg-agri-green hover:bg-agri-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>
                </form>
              )}
            </div>
          </div>

          <p className="text-center text-white/70 text-sm mt-4">
            {mode === 'login' ? (
              <>New to GrowSmart? <Link to="/login" onClick={() => setMode('signup')} className="text-emerald-300 font-medium hover:underline">Create an account</Link></>
            ) : (
              <>Already have an account? <Link to="/login" onClick={() => setMode('login')} className="text-emerald-300 font-medium hover:underline">Login here</Link></>
            )}
          </p>

          {otpSent && (
            <div className="mt-4 bg-green-500/20 border border-green-400/30 text-green-100 text-sm rounded-xl px-4 py-3">
              OTP sent! Check the server console for the mock OTP (dev mode).
            </div>
          )}
        </div>
      </div>
    </div>
  );
}