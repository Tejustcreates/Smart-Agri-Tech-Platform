import React, { useState } from 'react';
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
    <section id="login" className="min-h-[calc(100vh-80px)] flex">
      {/* Left Panel — Green branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-green-800 via-green-600 to-green-700 text-white p-8 lg:p-12 flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-56 h-56 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10 text-center">
          <i className="fas fa-tractor text-7xl mb-6 text-green-200"></i>
          <h2 className="text-4xl font-bold mb-4">Welcome Back, Farmer</h2>
          <p className="text-green-100 text-lg max-w-sm leading-relaxed">
            Your smart farming dashboard awaits. Check weather forecasts, manage your crops, and track market prices.
          </p>
          <div className="mt-8 flex gap-8 justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-200">10K+</p>
              <p className="text-sm text-green-100">Farmers</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-200">50+</p>
              <p className="text-sm text-green-100">Districts</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-200">12+</p>
              <p className="text-sm text-green-100">Languages</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome Back
            </h2>
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
                  className="w-full pl-12 pr-4 py-3 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                  className="w-full pl-12 pr-4 py-3 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
              className="w-full py-3.5 text-white bg-green-600 rounded-lg hover:bg-green-700 font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:bg-green-400 disabled:shadow-none flex items-center justify-center gap-2"
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
            <p className="text-gray-500">
              Don't have an account?{' '}
              <button onClick={onSwitchToSignup} className="text-green-600 hover:text-green-700 font-bold transition-colors">
                Sign Up Free
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
