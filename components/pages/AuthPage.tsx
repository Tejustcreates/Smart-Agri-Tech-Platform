import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { useAuthFlow } from '../../hooks/useAuthFlow';
import AuthModeTabs from '../auth/AuthModeTabs';
import AuthStepsForm from '../auth/AuthStepsForm';
import LanguageSwitcher from '../LanguageSwitcher';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialMode = location.pathname === '/signup' ? 'signup' : 'login';
  const flow = useAuthFlow(initialMode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 via-green-900 to-emerald-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg">
            <Sprout size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white">GROW<span className="text-emerald-400">SMART</span></span>
        </div>
        <LanguageSwitcher compact />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden">
            <AuthModeTabs mode={flow.mode} onChange={(m) => { flow.reset(m); navigate(m === 'login' ? '/login' : '/signup'); }} />

            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {flow.mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                {flow.mode === 'login' ? 'Login with your mobile number' : 'Register using your mobile number'}
              </p>

              <AuthStepsForm
                flow={flow}
                onLoginSuccess={(user) => navigate(user.isOnboarded ? '/dashboard' : '/onboarding')}
                onSignupAccountCreated={() => navigate('/onboarding')}
              />
            </div>
          </div>

          <p className="text-center text-white/70 text-sm mt-4">
            {flow.mode === 'login' ? (
              <>New to GrowSmart?{' '}
                <Link to="/signup" onClick={() => flow.reset('signup')} className="text-emerald-300 font-medium hover:underline">
                  Create an account
                </Link>
              </>
            ) : (
              <>Already have an account?{' '}
                <Link to="/login" onClick={() => flow.reset('login')} className="text-emerald-300 font-medium hover:underline">
                  Login here
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
