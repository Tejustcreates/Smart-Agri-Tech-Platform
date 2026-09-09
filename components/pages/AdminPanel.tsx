import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Spin, Tag, type TableColumnsType } from 'antd';
import _Result from 'antd/es/result';

const Result = _Result as unknown as React.FC<any>;
import { Home, LogOut, ChartLine, Users, Landmark, Newspaper, Tractor, Store, Toolbox, Wrench } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

type Tab = 'dashboard' | 'users' | 'schemes' | 'news' | 'equipment' | 'mandi';

interface AdminUser {
  id: string;
  name: string;
  mobileNumber: string;
  role: string;
  district?: string;
  state?: string;
  isActive: boolean;
}

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: ChartLine },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'schemes', label: 'Schemes', icon: Landmark },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'equipment', label: 'Equipment', icon: Tractor },
  { id: 'mandi', label: 'Mandi Prices', icon: Store },
];

const STAT_ITEMS: { key: string; label: string; icon: React.ElementType; color: string }[] = [
  { key: 'users', label: 'Users', icon: Users, color: 'text-blue-600 bg-blue-50' },
  { key: 'farms', label: 'Farms', icon: Tractor, color: 'text-emerald-600 bg-emerald-50' },
  { key: 'schemes', label: 'Schemes', icon: Landmark, color: 'text-indigo-600 bg-indigo-50' },
  { key: 'news', label: 'News Articles', icon: Newspaper, color: 'text-purple-600 bg-purple-50' },
  { key: 'equipment', label: 'Equipment', icon: Toolbox, color: 'text-orange-600 bg-orange-50' },
  { key: 'mandiPrices', label: 'Mandi Prices', icon: Store, color: 'text-teal-600 bg-teal-50' },
];

const USER_COLUMNS: TableColumnsType<AdminUser> = [
  { title: 'Name', dataIndex: 'name', key: 'name', render: (v) => <span className="font-medium text-gray-800">{v}</span> },
  { title: 'Mobile', dataIndex: 'mobileNumber', key: 'mobileNumber' },
  { title: 'Role', dataIndex: 'role', key: 'role', render: (v) => <Tag color="blue">{v}</Tag> },
  { title: 'District', dataIndex: 'district', key: 'district', render: (v) => v || '-' },
  { title: 'State', dataIndex: 'state', key: 'state', render: (v) => v || '-' },
  {
    title: 'Status',
    dataIndex: 'isActive',
    key: 'isActive',
    render: (active: boolean) => <Tag color={active ? 'success' : 'error'}>{active ? 'Active' : 'Inactive'}</Tag>,
  },
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [statsError, setStatsError] = useState('');
  const [usersError, setUsersError] = useState('');

  const loadStats = async () => {
    setLoading(true);
    setStatsError('');
    try {
      const data = await api.getAdminStats();
      setStats(data);
    } catch (e: any) {
      setStatsError(e?.message || 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    setUsersError('');
    try {
      const data = await api.getAdminUsers();
      setUsers(data.users || []);
    } catch (e: any) {
      setUsersError(e?.message || 'Failed to load users');
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
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-sm rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <Home size={14} />Home
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-sm rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <LogOut size={14} />Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all inline-flex items-center gap-2 ${
                tab === t.id
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-brand-50'
              }`}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-16">
            <Spin size="large" />
          </div>
        )}

        {!loading && tab === 'dashboard' && statsError && (
          <Result
            status="error"
            title="Couldn't load dashboard stats"
            subTitle={statsError}
            extra={<button onClick={loadStats} className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700">Retry</button>}
          />
        )}

        {!loading && tab === 'dashboard' && !statsError && stats && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {STAT_ITEMS.map((item) => (
              <div key={item.key} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} mb-3`}>
                  <item.icon size={17} />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats[item.key] ?? 0}</p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'users' && usersError && (
          <Result
            status="error"
            title="Couldn't load users"
            subTitle={usersError}
            extra={<button onClick={loadUsers} className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700">Retry</button>}
          />
        )}

        {!loading && tab === 'users' && !usersError && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Registered Farmers</h2>
            </div>
            <Table
              columns={USER_COLUMNS}
              dataSource={users}
              rowKey="id"
              pagination={{ pageSize: 10, hideOnSinglePage: true }}
              locale={{ emptyText: 'No farmers registered yet' }}
            />
          </div>
        )}

        {!loading && tab !== 'dashboard' && tab !== 'users' && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wrench size={26} className="text-gray-300" />
            </div>
            <h3 className="font-semibold text-gray-700">CRUD Management</h3>
            <p className="text-gray-400 text-sm mt-1">
              Full CRUD interface for {tab} coming via the backend API.
              The API endpoints are ready at <code className="text-xs bg-gray-50 px-2 py-0.5 rounded">/api/admin/{tab}</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
