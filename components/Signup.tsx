import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { User } from '../types';
import { signUpUser } from '../services/sheetService';

interface SignupProps {
  onSignup: (user: { name: string }) => void;
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup, onSwitchToLogin }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const newUser: User = {
      name,
      email,
      password,
      signedUpAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    };
    const result = await signUpUser(newUser);

    if (result.user) {
      toast.success(`Welcome, ${result.user.name}! Account created successfully.`);
      onSignup(result.user);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <section id="signup" className="min-h-[calc(100vh-64px)]">
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
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 text-white p-8 lg:p-12 flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 text-center">
            <i className="fas fa-seedling text-7xl mb-6 text-brand-200"></i>
            <h2 className="text-4xl font-bold mb-4">Join the Farming Revolution</h2>
            <p className="text-white/70 text-lg max-w-sm leading-relaxed">
              Get access to smart weather predictions, live mandi prices, crop disease diagnosis, and government schemes — all in one place.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <i className="fas fa-cloud-sun text-2xl text-brand-200 mb-1"></i>
                <p className="font-medium">Weather Alerts</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <i className="fas fa-store text-2xl text-brand-200 mb-1"></i>
                <p className="font-medium">Live Mandi Prices</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <i className="fas fa-leaf text-2xl text-brand-200 mb-1"></i>
                <p className="font-medium">Crop Advisor</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <i className="fas fa-landmark text-2xl text-brand-200 mb-1"></i>
                <p className="font-medium">Govt Schemes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel — Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 bg-gray-50">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
              <p className="text-gray-500 mt-2">Start your smart farming journey</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"><i className="fas fa-user"></i></span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-3.5 min-h-[48px] text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              <div className="mb-5">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"><i className="fas fa-envelope"></i></span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3.5 min-h-[48px] text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              <div className="mb-5">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"><i className="fas fa-lock"></i></span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Min. 6 characters"
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 min-h-[48px] text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                {password.length > 0 && password.length < 6 && (
                  <p className="text-red-500 text-xs mt-1"><i className="fas fa-exclamation-circle mr-1"></i>Password must be at least 6 characters</p>
                )}
              </div>
              <div className="mb-6">
                <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"><i className="fas fa-lock"></i></span>
                  <input
                    type="password"
                    id="confirm-password"
                    name="confirm-password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 min-h-[48px] text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                {confirmPassword.length > 0 && (
                  <p className={`text-xs mt-1 ${password === confirmPassword ? 'text-brand-600' : 'text-red-500'}`}>
                    <i className={`fas ${password === confirmPassword ? 'fa-check-circle' : 'fa-times-circle'} mr-1`}></i>
                    {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                  </p>
                )}
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
                  <><i className="fas fa-spinner fa-spin"></i> Creating Account...</>
                ) : (
                  <><i className="fas fa-user-plus"></i> Sign Up</>
                )}
              </button>
            </form>
            <div className="text-center mt-6">
              <button
                onClick={onSwitchToLogin}
                className="text-brand-600 hover:text-brand-700 font-bold text-lg min-h-[48px] inline-flex items-center gap-1 transition-colors"
              >
                Already have an account? Login <i className="fas fa-arrow-right text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
