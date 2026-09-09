import React from 'react';
import type { AuthMode } from '../../hooks/useAuthFlow';

interface AuthModeTabsProps {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
  className?: string;
}

const AuthModeTabs: React.FC<AuthModeTabsProps> = ({ mode, onChange, className = '' }) => (
  <div className={`flex border-b border-gray-200 ${className}`}>
    <button
      type="button"
      onClick={() => onChange('login')}
      className={`flex-1 py-3 text-sm font-semibold transition-colors ${mode === 'login' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-400 hover:text-gray-600'}`}
    >
      Login
    </button>
    <button
      type="button"
      onClick={() => onChange('signup')}
      className={`flex-1 py-3 text-sm font-semibold transition-colors ${mode === 'signup' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-400 hover:text-gray-600'}`}
    >
      Sign Up
    </button>
  </div>
);

export default AuthModeTabs;
