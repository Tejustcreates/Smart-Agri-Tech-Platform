import React, { useState, Component, FormEvent, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { INDIAN_STATES, DISTRICTS_BY_STATE } from '../constants/locations';

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

export default function Onboarding() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    village: '',
    taluka: '',
    district: '',
    state: '',
    landholdingSize: '',
    farmerCategory: 'SMALL',
    preferredLanguage: user?.preferredLanguage || 'en',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.state || !form.district) {
      setError('Please select your state and district');
      return;
    }

    setLoading(true);
    try {
      const apiModule = await import('../../services/api');
      const apiClient = apiModule.default;
      const { user: updated } = await apiClient.updateProfile({
        ...form,
        landholdingSize: form.landholdingSize ? parseFloat(form.landholdingSize) : undefined,
      });
      updateUser(updated);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const districts = form.state ? DISTRICTS_BY_STATE[form.state] || [] : [];

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <Boundary>
      <div className="min-h-screen bg-gradient-to-br from-brand-900 via-green-900 to-emerald-900 flex flex-col">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                <path d="M12 2C7 4 4 8 4 13c0 4.42 3.58 8 8 8s8-3.58 8-8c0-5-3-9-8-11z" fill="currentColor" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white">GROW<span className="text-emerald-400">SMART</span></span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Complete Your Profile</h2>
            <p className="text-sm text-gray-500 mb-6">This helps us personalize your farming experience</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Village</label>
                <input
                  type="text"
                  value={form.village}
                  onChange={(e) => set({ village: e.target.value })}
                  placeholder="Enter your village name"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-agri-green transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Taluka</label>
                <input
                  type="text"
                  value={form.taluka}
                  onChange={(e) => set({ taluka: e.target.value })}
                  placeholder="Enter your taluka"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-agri-green transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  value={form.state}
                  onChange={(e) => set({ state: e.target.value, district: '' })}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-agri-green transition-colors"
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                <select
                  value={form.district}
                  onChange={(e) => set({ district: e.target.value })}
                  disabled={!form.state}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-agri-green transition-colors"
                >
                  <option value="">{form.state ? 'Select district' : 'Select state first'}</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Landholding (acres)</label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={form.landholdingSize}
                  onChange={(e) => set({ landholdingSize: e.target.value })}
                  placeholder="e.g., 3.5"
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-agri-green transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farmer Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: 'MARGINAL', label: 'Marginal' },
                    { code: 'SMALL', label: 'Small' },
                    { code: 'LARGE', label: 'Large' },
                  ].map((cat) => (
                    <button
                      key={cat.code}
                      type="button"
                      onClick={() => set({ farmerCategory: cat.code })}
                      className={`p-3 rounded-xl border-2 text-center transition-colors ${
                        form.farmerCategory === cat.code
                          ? 'border-agri-green bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className={`block text-sm font-semibold ${form.farmerCategory === cat.code ? 'text-agri-green' : 'text-gray-700'}`}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-agri-green hover:bg-agri-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50 min-h-[48px]"
              >
                {loading ? 'Saving...' : 'Save & Continue'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full text-center text-sm text-gray-400 hover:text-gray-600 font-medium"
              >
                Skip for now
              </button>
            </form>
          </div>
        </div>
      </div>
    </Boundary>
  );
}
