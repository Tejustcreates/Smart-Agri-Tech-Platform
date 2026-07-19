import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
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
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await loginUser(email, password);

    if (result.user) {
      toast.success(`Welcome back, ${result.user.name}!`);
      onLogin(result.user);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <section id="login" className="min-h-[calc(100vh-64px)]">
      {/* Brand-900 header bar */}
      <div className="bg-brand-900 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="text-white/70 hover:text-white min-h-[48px] min-w-[48px] flex items-center justify-center" aria-label="Go home">
          <i className="fas fa-arrow-left text-lg"></i>
        </button>
        <div className="flex items-center gap-2">
          <i className="fas fa-leaf text-brand-400"></i>
          <span className="text-white font-bold">GROWSMART</span>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-112px)]">
        {/* Left Panel — Brand branding */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-brand-800 via-brand-700 to-brand-900 text-white p-8 lg:p-12 flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 right-10 w-56 h-56 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 text-center">
            <i className="fas fa-tractor text-7xl mb-6 text-brand-300"></i>
            <h2 className="text-4xl font-bold mb-4">Welcome Back, Farmer</h2>
            <p className="text-white/70 text-lg max-w-sm leading-relaxed">
              Your smart farming dashboard awaits. Check weather forecasts, manage your crops, and track market prices.
            </p>
            <div className="mt-8 flex gap-8 justify-center">
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-200">10K+</p>
                <p className="text-sm text-white/60">Farmers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-200">50+</p>
                <p className="text-sm text-white/60">Districts</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-brand-200">12+</p>
                <p className="text-sm text-white/60">Languages</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-gray-50">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-500 mt-2">Sign in to your GROWSMART account</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"><i className="fas fa-envelope"></i></span>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3.5 min-h-[48px] text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"><i className="fas fa-lock"></i></span>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-4 py-3.5 min-h-[48px] text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                  <i className="fas fa-exclamation-triangle"></i>
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full py-3.5 min-h-[48px] text-white bg-brand-600 rounded-lg hover:bg-brand-700 font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:bg-brand-400 disabled:shadow-none flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Signing In...</>
                ) : (
                  <><i className="fas fa-sign-in-alt"></i> Login</>
                )}
              </button>
            </form>
            <div className="text-center mt-6">
              <button
                onClick={onSwitchToSignup}
                className="text-brand-600 hover:text-brand-700 font-bold text-lg min-h-[48px] inline-flex items-center gap-1 transition-colors"
              >
                Don't have an account? Sign Up Free <i className="fas fa-arrow-right text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
