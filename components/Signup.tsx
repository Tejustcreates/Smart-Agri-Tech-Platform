import React, { useState } from 'react';
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

    const newUser: User = { name, email, password };
    const result = await signUpUser(newUser);

    if (result.user) {
      onSignup(result.user);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <section id="signup" className="py-20 bg-gray-100 flex items-center justify-center min-h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Join <span className="text-green-600">GROWSMART</span> Today
            </h2>
            <p className="text-gray-500 mt-2">Create your account</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                className="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
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
                name="password"
                placeholder="Min. 6 characters"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              {password.length > 0 && password.length < 6 && (
                <p className="text-red-500 text-xs mt-1">Password must be at least 6 characters</p>
              )}
            </div>
             <div className="mb-6">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                name="confirm-password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              {confirmPassword.length > 0 && (
                <p className={`text-xs mt-1 ${password === confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                  {password === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                </p>
              )}
            </div>
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            <div className="text-center">
              <button type="submit" className="w-full px-8 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 font-bold text-lg transition-colors disabled:bg-green-400" disabled={loading}>
                 {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : 'Sign Up'}
              </button>
            </div>
          </form>
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button onClick={onSwitchToLogin} className="text-green-600 hover:underline font-semibold">
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;