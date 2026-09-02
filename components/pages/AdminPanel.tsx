import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

type Tab = 'dashboard' | 'users' | 'schemes' | 'news' | 'equipment' | 'mandi';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminStats();
      setStats(data);
    } catch (e) {
      console.error('Failed to load stats', e);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminUsers();
      setUsers(data.users || []);
    } catch (e) {
      console.error('Failed to load users', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === 'dashboard') loadStats();
    if (tab === 'users') loadUsers();
  }, [tab]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-brand-900 text-white px-4 sm:px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Admin Panel</h1>
              <p className="text-brand-100 mt-1 text-sm">Manage GrowSmart platform</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-sm rounded-xl transition-colors"
              >
                <i className="fas fa-home mr-2"></i>Home
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-sm rounded-xl transition-colors"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {[
            { id: 'dashboard' as Tab, label: 'Dashboard', icon: 'fa-chart-line' },
            { id: 'users' as Tab, label: 'Users', icon: 'fa-users' },
            { id: 'schemes' as Tab, label: 'Schemes', icon: 'fa-landmark' },
            { id: 'news' as Tab, label: 'News', icon: 'fa-newspaper' },
            { id: 'equipment' as Tab, label: 'Equipment', icon: 'fa-tractor' },
            { id: 'mandi' as Tab, label: 'Mandi Prices', icon: 'fa-store' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.id
                  ? 'bg-agri-green text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-green-50'
              }`}
            >
              <i className={`fas ${t.icon} mr-2`}></i>
              {t.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-agri-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        )}

        {!loading && tab === 'dashboard' && stats && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Users', value: stats.users, icon: 'fa-users', color: 'text-blue-600 bg-blue-50' },
              { label: 'Farms', value: stats.farms, icon: 'fa-tractor', color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Schemes', value: stats.schemes, icon: 'fa-landmark', color: 'text-indigo-600 bg-indigo-50' },
              { label: 'News Articles', value: stats.news, icon: 'fa-newspaper', color: 'text-purple-600 bg-purple-50' },
              { label: 'Equipment', value: stats.equipment, icon: 'fa-toolbox', color: 'text-orange-600 bg-orange-50' },
              { label: 'Mandi Prices', value: stats.mandiPrices, icon: 'fa-store', color: 'text-teal-600 bg-teal-50' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} mb-3`}>
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'users' && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Registered Farmers</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium">Name</th>
                    <th className="text-left px-5 py-3 font-medium">Mobile</th>
                    <th className="text-left px-5 py-3 font-medium">Role</th>
                    <th className="text-left px-5 py-3 font-medium">District</th>
                    <th className="text-left px-5 py-3 font-medium">State</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">{u.name}</td>
                      <td className="px-5 py-3 text-gray-600">{u.mobileNumber}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700 font-medium">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{u.district || '-'}</td>
                      <td className="px-5 py-3 text-gray-600">{u.state || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && tab !== 'dashboard' && tab !== 'users' && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-tools text-gray-300 text-2xl"></i>
            </div>
            <h3 className="font-semibold text-gray-700">CRUD Management</h3>
            <p className="text-gray-400 text-sm mt-1 mt-2">
              Full CRUD interface for {tab} coming via the backend API.
              The API endpoints are ready at <code className="text-xs bg-gray-50 px-2 py-0.5 rounded">/api/admin/{tab}</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}