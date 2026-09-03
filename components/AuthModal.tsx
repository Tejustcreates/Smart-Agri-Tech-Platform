import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

type AuthStep = 'mobile' | 'otp' | 'signup' | 'onboarding';
type AuthMode = 'login' | 'signup';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

interface OnboardingForm {
  village: string;
  taluka: string;
  district: string;
  state: string;
  landholdingSize: string;
  farmerCategory: string;
}

const INDIAN_STATES = [
  'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Gujarat', 'Uttar Pradesh',
  'Punjab', 'Haryana', 'Rajasthan', 'Madhya Pradesh',
];

const DISTRICTS: Record<string, string[]> = {
  'Maharashtra': ['Pune', 'Nashik', 'Nagpur', 'Aurangabad', 'Solapur', 'Satara', 'Kolhapur', 'Sangli', 'Sindhudurg', 'Ratnagiri'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Belagavi', 'Hubli', 'Mangaluru', 'Hassan'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tirunelveli'],
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Anand'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Meerut'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Hisar'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Gwalior', 'Ujjain'],
};

export default function AuthModal({ open, onClose, initialMode = 'login' }: AuthModalProps) {
  const { t } = useTranslation();
  const { login, signup, requestOtp, user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [step, setStep] = useState<AuthStep>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [language, setLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [obForm, setObForm] = useState<OnboardingForm>({
    village: '', taluka: '', district: '', state: '', landholdingSize: '', farmerCategory: 'SMALL',
  });

  // Reset when opened
  React.useEffect(() => {
    if (open) {
      setMode(initialMode);
      setStep('mobile');
      setError('');
      setMobileNumber('');
      setOtp('');
      setName('');
    }
  }, [open, initialMode]);

  React.useEffect(() => {
    if (!open) {
      const id = setTimeout(onClose, 300);
      return () => clearTimeout(id);
    }
  }, [open, onClose]);

  const handleSendOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      setError(t('auth.invalidMobile'));
      return;
    }
    setLoading(true);
    try {
      await requestOtp(mobileNumber, mode === 'login' ? 'LOGIN' : 'SIGNUP');
      setStep('otp');
    } catch (err: any) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^\d{6}$/.test(otp)) {
      setError(t('auth.invalidOtp'));
      return;
    }
    setLoading(true);
    try {
      if (mode === 'login') {
        const u = await login(mobileNumber, otp);
        if (u) {
          setStep(u.isOnboarded ? 'mobile' : 'onboarding');
          if (u.isOnboarded) onClose();
        } else {
          setError(t('auth.verificationFailed'));
        }
      } else {
        await api.verifyOtp(mobileNumber, otp, 'SIGNUP');
        setStep('signup');
      }
    } catch (err: any) {
      setError(err.message || t('auth.verificationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (name.trim().length < 2) {
      setError(t('auth.nameRequired'));
      return;
    }
    setLoading(true);
    try {
      const result = await api.signup({ mobileNumber, otp, name, preferredLanguage: language });
      localStorage.setItem('growsmart_user', JSON.stringify(result.user));
      setStep('onboarding');
    } catch (err: any) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleOnboarding = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!obForm.state || !obForm.district) {
      setError(t('auth.invalidStateDistrict'));
      return;
    }
    setLoading(true);
    try {
      const { user: updated } = await api.updateProfile({
        village: obForm.village,
        taluka: obForm.taluka,
        district: obForm.district,
        state: obForm.state,
        landholdingSize: obForm.landholdingSize ? parseFloat(obForm.landholdingSize) : undefined,
        farmerCategory: obForm.farmerCategory,
      });
      updateUser(updated);
      onClose();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const obObj = { value: obForm, set: (patch: Partial<OnboardingForm>) => setObForm((f) => ({ ...f, ...patch })) };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-br from-brand-900 via-green-900 to-emerald-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white">
                <path d="M12 2C7 4 4 8 4 13c0 4.42 3.58 8 8 8s8-3.58 8-8c0-5-3-9-8-11z" fill="currentColor" />
              </svg>
            </div>
            <span className="text-white font-bold">GROW<span className="text-emerald-400">SMART</span></span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact />
            <button onClick={onClose} aria-label={t('common.close')} className="text-white/80 hover:text-white p-1.5">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {/* MODE TABS */}
          {step !== 'onboarding' && (
            <div className="flex border-b border-gray-200 mb-5">
              <button
                onClick={() => { setMode('login'); setStep('mobile'); setError(''); }}
                className={`flex-1 py-3 text-sm font-semibold ${mode === 'login' ? 'text-agri-green border-b-2 border-agri-green' : 'text-gray-400'}`}
              >
                Login
              </button>
              <button
                onClick={() => { setMode('signup'); setStep('mobile'); setError(''); }}
                className={`flex-1 py-3 text-sm font-semibold ${mode === 'signup' ? 'text-agri-green border-b-2 border-agri-green' : 'text-gray-400'}`}
              >
                Sign Up
              </button>
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            {step === 'onboarding' ? 'Complete Your Profile' : mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {step === 'onboarding'
              ? 'This helps us personalize your farming experience'
              : mode === 'login'
                ? 'Login with your mobile number'
                : 'Register using your mobile number'}
          </p>

          {step === 'mobile' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-3 bg-gray-100 rounded-l-xl text-gray-600 text-sm font-semibold border-2 border-r-0 border-gray-200">+91</span>
                  <input
                    type="tel" inputMode="numeric" maxLength={10} value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile number" autoFocus
                    className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-r-xl text-gray-800 text-base placeholder-gray-400 focus:outline-none focus:border-agri-green transition-colors"
                  />
                </div>
              </div>
              <button type="submit" disabled={loading || mobileNumber.length !== 10} className="w-full py-4 bg-agri-green hover:bg-agri-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50 min-h-[48px]">
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
                <input
                  type="text" inputMode="numeric" maxLength={6} value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="6-digit OTP" autoFocus
                  className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 text-2xl font-bold tracking-[0.3em] text-center placeholder:font-normal placeholder:text-sm placeholder:text-gray-400 focus:outline-none focus:border-agri-green transition-colors"
                />
                <p className="mt-2 text-xs text-gray-500">
                  OTP sent to +91 {mobileNumber}{' '}
                  <button type="button" onClick={() => { setStep('mobile'); setOtp(''); }} className="text-agri-green font-medium hover:underline">Change</button>
                </p>
              </div>
              <button type="submit" disabled={loading || otp.length !== 6} className="w-full py-4 bg-agri-green hover:bg-agri-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50 min-h-[48px]">
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <button type="button" onClick={() => { setStep('mobile'); setOtp(''); }} className="w-full text-center text-sm text-agri-green font-medium hover:underline">
                Resend OTP
              </button>
            </form>
          )}

          {step === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" autoFocus
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 text-base placeholder-gray-400 focus:outline-none focus:border-agri-green transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ code: 'en', label: 'English' }, { code: 'hi', label: 'हिन्दी' }, { code: 'mr', label: 'मराठी' }].map((l) => (
                    <button key={l.code} type="button" onClick={() => setLang(l.code)}
                      className={`py-3 rounded-xl text-sm font-medium border-2 ${language === l.code ? 'border-agri-green bg-green-50 text-agri-green' : 'border-gray-200 text-gray-500'}`}>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={loading || name.trim().length < 2} className="w-full py-4 bg-agri-green hover:bg-agri-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50 min-h-[48px]">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {step === 'onboarding' && (
            <form onSubmit={handleOnboarding} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
                <input type="text" value={obObj.value.village} onChange={(e) => obObj.set({ village: e.target.value })} placeholder="Enter village"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-agri-green transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Taluka</label>
                <input type="text" value={obObj.value.taluka} onChange={(e) => obObj.set({ taluka: e.target.value })} placeholder="Enter taluka"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-agri-green transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select value={obObj.value.state} onChange={(e) => obObj.set({ state: e.target.value, district: '' })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-agri-green transition-colors">
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <select value={obObj.value.district} onChange={(e) => obObj.set({ district: e.target.value })} disabled={!obObj.value.state}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-agri-green transition-colors">
                  <option value="">{obObj.value.state ? 'Select district' : 'Select state first'}</option>
                  {(DISTRICTS[obObj.value.state] || []).map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Landholding (acres)</label>
                <input type="number" min="0" step="0.5" value={obObj.value.landholdingSize} onChange={(e) => obObj.set({ landholdingSize: e.target.value })} placeholder="e.g., 3.5"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-agri-green transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farmer Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ code: 'MARGINAL', label: 'Marginal' }, { code: 'SMALL', label: 'Small' }, { code: 'LARGE', label: 'Large' }].map((c) => (
                    <button key={c.code} type="button" onClick={() => obObj.set({ farmerCategory: c.code })}
                      className={`p-3 rounded-xl border-2 text-sm font-semibold ${obObj.value.farmerCategory === c.code ? 'border-agri-green bg-green-50 text-agri-green' : 'border-gray-200 text-gray-700'}`}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-4 bg-agri-green hover:bg-agri-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50 min-h-[48px]">
                {loading ? 'Saving...' : 'Save & Continue'}
              </button>
              <button type="button" onClick={onClose} className="w-full text-center text-sm text-gray-400 hover:text-gray-600 font-medium">Skip for now</button>
            </form>
          )}

          {user && step === 'mobile' && mode === 'login' && (
            <div className="mt-4 text-center">
              <button onClick={onClose} className="text-agri-green font-medium hover:underline">Continue as {user.name}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
