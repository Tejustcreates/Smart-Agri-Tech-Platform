import React, { useState } from 'react';
import { User } from '../types';
import { loginUser } from '../services/sheetService';

interface LoginProps {
  onLogin: (user: { name: string }) => void;
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await loginUser(email, password);

    if (result.user) {
      onLogin(result.user);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <section id="login" className="py-20 bg-gray-100 flex items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome Back to <span className="text-green-600">GROWSMART</span>
            </h2>
            <p className="text-gray-500 mt-2">Sign in to continue</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            <div className="text-center">
              <button type="submit" className="w-full px-8 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 font-bold text-lg transition-colors disabled:bg-green-400" disabled={loading}>
                {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : 'Login'}
              </button>
            </div>
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button onClick={onSwitchToSignup} className="text-green-600 hover:underline font-semibold">
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;