import React, { Component, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { useOnboardingSubmit } from '../../hooks/useOnboardingSubmit';
import OnboardingForm from '../auth/OnboardingForm';

// Error boundary so white screen is replaced by a readable error instead
interface BoundaryProps { children?: ReactNode }
class Boundary extends Component<BoundaryProps, { error: string }> {
  state = { error: '' };
  static getDerivedStateFromError(e: any) {
    return { error: e?.message || String(e) };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-700 font-semibold mb-2">Something went wrong</p>
            <pre className="text-xs text-red-600 whitespace-pre-wrap">{this.state.error}</pre>
          </div>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

function OnboardingContent() {
  const navigate = useNavigate();
  const onboarding = useOnboardingSubmit(() => navigate('/dashboard'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-green-900 to-emerald-900 flex flex-col">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg">
            <Sprout size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white">GROW<span className="text-emerald-400">SMART</span></span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Complete Your Profile</h2>
          <p className="text-sm text-gray-500 mb-6">This helps us personalize your farming experience</p>

          <OnboardingForm
            loading={onboarding.loading}
            error={onboarding.error}
            onSubmit={onboarding.submit}
            onSkip={() => navigate('/dashboard')}
          />
        </div>
      </div>
    </div>
  );
}

export default function Onboarding() {
  return (
    <Boundary>
      <OnboardingContent />
    </Boundary>
  );
}
