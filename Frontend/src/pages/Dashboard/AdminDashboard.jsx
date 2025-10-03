// src/pages/Dashboard/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    stores: 0,
    ratings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/', { replace: true });
      return;
    }

    const fetchStats = async () => {
      try {
        const [usersRes, storesRes, ratingsRes] = await Promise.all([
          apiClient.get('/users'),
          apiClient.get('/stores'),
          apiClient.get('/ratings'),
        ]);

        setStats({
          users: usersRes.data.length,
          stores: storesRes.data.length,
          ratings: ratingsRes.data.length,
        });
      } catch (err) {
        console.error("Failed to load stats:", err);
        const message = err.response?.status === 401
          ? "Session expired. Please log in again."
          : "Could not load dashboard data. Please try again.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, navigate]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
              <p className="text-lg text-gray-600 mt-1">
                Welcome back,{' '}
                <span className="font-semibold text-indigo-600">{user.name.split(' ')[0]}</span> 👋
              </p>
            </div>

            {/* Back to Home Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/')}
              className="self-start sm:self-center shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-500 rounded-r-lg shadow-sm animate-fade-in">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-base font-medium text-red-800">Error Loading Data</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-xl text-gray-600 font-medium">Loading statistics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Users Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-blue-500 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Total Users</p>
                  <p className="mt-2 text-4xl font-bold text-gray-900">{stats.users}</p>
                  <p className="mt-1 text-sm text-gray-500">Customers, owners, admins</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full text-blue-600 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </Card>

            {/* Total Stores Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-green-500 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 uppercase tracking-wide">Total Stores</p>
                  <p className="mt-2 text-4xl font-bold text-gray-900">{stats.stores}</p>
                  <p className="mt-1 text-sm text-gray-500">Registered on platform</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full text-green-600 group-hover:bg-green-200 transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-6 4h6m2 5H7m2-5h6m-6 4h6" />
                  </svg>
                </div>
              </div>
            </Card>

            {/* Total Ratings Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-l-purple-500 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 uppercase tracking-wide">Total Ratings</p>
                  <p className="mt-2 text-4xl font-bold text-gray-900">{stats.ratings}</p>
                  <p className="mt-1 text-sm text-gray-500">Customer feedback collected</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full text-purple-600 group-hover:bg-purple-200 transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card title="Quick Actions" className="bg-white shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button
              variant="primary"
              onClick={() => navigate('/users')}
              className="py-3 text-sm sm:text-base font-semibold hover:scale-105 transition-transform"
            >
              👥 Manage All Users
            </Button>
            <Button
              variant="success"
              onClick={() => navigate('/stores/create')}
              className="py-3 text-sm sm:text-base font-semibold hover:scale-105 transition-transform"
            >
              🛒 Add New Store
            </Button>
            <Button
              variant="info"
              onClick={() => navigate('/admin/stores-ratings')}
              className="py-3 text-sm sm:text-base font-semibold hover:scale-105 transition-transform"
            >
              📊 View Stores & Ratings
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}