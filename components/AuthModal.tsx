import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import { Sprout, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAuthFlow, type AuthMode } from '../hooks/useAuthFlow';
import { useOnboardingSubmit } from '../hooks/useOnboardingSubmit';
import AuthModeTabs from './auth/AuthModeTabs';
import AuthStepsForm from './auth/AuthStepsForm';
import OnboardingForm from './auth/OnboardingForm';
import LanguageSwitcher from './LanguageSwitcher';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
}

export default function AuthModal({ open, onClose, initialMode = 'login' }: AuthModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const flow = useAuthFlow(initialMode);
  const [modalStep, setModalStep] = useState<'auth' | 'onboarding'>('auth');

  useEffect(() => {
    if (open) {
      flow.reset(initialMode);
      setModalStep('auth');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialMode]);

  const onboarding = useOnboardingSubmit((_updatedUser) => {
    onClose();
    navigate('/dashboard');
  });

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={420}
      closable={false}
      styles={{ content: { padding: 0, borderRadius: 24, overflow: 'hidden' }, body: { padding: 0 } }}
    >
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-br from-brand-900 via-green-900 to-emerald-900">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
            <Sprout size={16} className="text-white" />
          </div>
          <span className="text-white font-bold">GROW<span className="text-emerald-400">SMART</span></span>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          <button onClick={onClose} aria-label="Close" className="text-white/80 hover:text-white p-1.5">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {modalStep === 'onboarding' ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Complete Your Profile</h2>
            <p className="text-sm text-gray-500 mb-6">This helps us personalize your farming experience</p>
            <OnboardingForm
              loading={onboarding.loading}
              error={onboarding.error}
              onSubmit={onboarding.submit}
              onSkip={onClose}
            />
          </>
        ) : (
          <>
            <AuthModeTabs mode={flow.mode} onChange={flow.setMode} className="mb-5" />
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {flow.mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {flow.mode === 'login' ? 'Login with your mobile number' : 'Register using your mobile number'}
            </p>
            <AuthStepsForm
              flow={flow}
              onLoginSuccess={(loggedInUser) => {
                if (loggedInUser.isOnboarded) onClose();
                else setModalStep('onboarding');
              }}
              onSignupAccountCreated={() => setModalStep('onboarding')}
            />
            {user && (
              <div className="mt-4 text-center">
                <button onClick={onClose} className="text-brand-600 font-medium hover:underline">
                  Continue as {user.name}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
