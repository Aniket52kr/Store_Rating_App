// src/pages/Dashboard/StoreOwnerDashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext';

export default function StoreOwnerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ownedStores, setOwnedStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch only stores owned by this user
  useEffect(() => {
    if (!user || user.role !== 'store_owner') return;

    const fetchOwnedStores = async () => {
      try {
        const res = await apiClient.get('/stores');
        const myStores = res.data.filter(store => store.owner_id === user.id);
        setOwnedStores(myStores);

        if (myStores.length > 0) {
          setSelectedStoreId(myStores[0].id); // Auto-select first
        }
      } catch (err) {
        console.error("Failed to load your stores", err);
        alert("Could not retrieve your stores. Please try again.");
      }
    };

    fetchOwnedStores();
  }, [user]);

  // Fetch ratings for selected store
  useEffect(() => {
    if (!selectedStoreId || !user) return;

    const fetchRatings = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/stores/${selectedStoreId}/ratings`);
        setRatings(res.data);

        const avg = res.data.reduce((sum, r) => sum + r.rating, 0) / res.data.length;
        setAverageRating(avg.toFixed(2));
      } catch (err) {
        console.error("Failed to load ratings", err);
        alert("Could not load ratings for this store.");
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [selectedStoreId, user]);

  // Access denied if not store owner
  if (!user || user.role !== 'store_owner') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="text-center p-6 max-w-sm">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium text-lg">Access Denied</p>
          <p className="text-gray-500 mt-1">This page is only for store owners.</p>
          <Button onClick={() => navigate('/')} className="mt-4 w-full">
            ← Go Home
          </Button>
        </Card>
      </div>
    );
  }

  // No stores assigned
  if (ownedStores.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-lg border-b">
          <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Store Owner Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome, <strong>{user.name.split(' ')[0]}</strong> 👋</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/')}
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                ← Back to Home
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h6m-6 4h6m2 5H7m2-5h6m-6 4h6" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Store Assigned</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              You haven't been assigned as owner of any store yet.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Contact the admin to link a store to your account.
            </p>
            <div className="mt-6 space-y-3 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
              <Button
                variant="primary"
                onClick={() => navigate('/dashboard/user')}
                className="w-full sm:w-auto"
              >
                ← My Dashboard
              </Button>
              <Button
                variant="info"
                onClick={() => navigate('/')}
                className="w-full sm:w-auto"
              >
                Go to Home
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Current store
  const currentStore = ownedStores.find(s => s.id === selectedStoreId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Store Owner Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back,{' '}
                <span className="font-semibold text-indigo-600">{user.name.split(' ')[0]}</span> 
              </p>
            </div>
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
        {/* Select Store */}
        <Card title="Your Store" className="bg-white shadow-lg overflow-hidden">
          <div className="mb-2 text-sm text-gray-600">
            Choose the store you'd like to view feedback for.
          </div>
          <select
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            className="w-full sm:w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
          >
            <option value="">Choose your store</option>
            {ownedStores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name} ({store.address.substring(0, 30)}...)
              </option>
            ))}
          </select>
        </Card>

        {/* Store Info Banner (Optional) */}
        {currentStore && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">{currentStore.name}</h3>
            <p className="text-gray-600"><strong>Email:</strong> {currentStore.email || 'Not available'}</p>
            <p className="text-gray-600"><strong>Address:</strong> {currentStore.address}</p>
          </div>
        )}

        {/* Ratings Summary */}
        {selectedStoreId && (
          <Card title="Customer Feedback" className="bg-white shadow-lg">
            {loading ? (
              <div className="flex flex-col items-center py-6">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <span className="mt-3 text-gray-600">Loading ratings...</span>
              </div>
            ) : ratings.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500 italic">No ratings yet for this store.</p>
                <p className="text-sm text-gray-400 mt-1">Keep providing great service — reviews will come!</p>
              </div>
            ) : (
              <>
                <div className="mb-5 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-yellow-800 font-medium">Average Rating</p>
                      <p className="text-3xl font-bold text-yellow-700">{averageRating} ★</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Reviews</p>
                      <p className="text-xl font-semibold text-gray-800">{ratings.length}</p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Customer</th>
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ratings.map((r, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="border border-gray-300 px-4 py-2 font-medium">{r.name}</td>
                          <td className="border border-gray-300 px-4 py-2 text-gray-700">{r.email}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <span className="font-bold text-yellow-600">{r.rating} ★</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Card>
        )}
      </main>
    </div>
  );
}