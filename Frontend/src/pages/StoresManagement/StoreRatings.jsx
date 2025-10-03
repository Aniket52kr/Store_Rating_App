// src/pages/StoresManagement/StoreRatings.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import Button from '../../components/Button';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../context/AuthContext'; 

export default function StoreRatings() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Use context instead of direct localStorage
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [ownedStores, setOwnedStores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [stats, setStats] = useState({ average: 0, total: 0 });
  const [loading, setLoading] = useState(false);

  // Fetch only stores where owner_id = user.id
  useEffect(() => {
    if (!user || user.role !== 'store_owner') return;

    const fetchOwnedStores = async () => {
      try {
        const res = await apiClient.get('/stores');
        const myStores = res.data.filter(store => store.owner_id === user.id);
        setOwnedStores(myStores);

        // Auto-select first owned store if available
        if (myStores.length > 0) {
          setSelectedStoreId(myStores[0].id);
        }
      } catch (err) {
        console.error("Failed to load your stores", err);
        alert("Could not retrieve your stores. Please try again.");
      }
    };

    fetchOwnedStores();
  }, [user]);

  // Fetch ratings when store selected
  useEffect(() => {
    if (!selectedStoreId || !user) return;

    const fetchRatings = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/stores/${selectedStoreId}/ratings`);
        setRatings(res.data);

        const total = res.data.length;
        const avg = total
          ? (res.data.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(2)
          : 0;

        setStats({ total, average: parseFloat(avg) });
      } catch (err) {
        console.error("Failed to load ratings", err);
        alert("Could not retrieve ratings for this store.");
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [selectedStoreId, user]);

  // Access denied if not store owner
  if (!user || user.role !== 'store_owner') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <p className="text-red-600">Access denied. This page is only for store owners.</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go Home
          </Button>
        </Card>
      </div>
    );
  }

  // No stores assigned
  if (ownedStores.length === 0 && !selectedStoreId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-gray-800">Your Store Ratings</h1>
            <p className="text-gray-600">See feedback from customers who visited your store.</p>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Card title="No Stores Assigned">
            <p className="text-gray-600">
              You haven't been assigned as owner of any store yet.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Contact admin to link a store to your account.
            </p>
            <Button onClick={() => navigate('/dashboard/user')} className="mt-4">
              ← Back to Dashboard
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-800">Your Store Ratings</h1>
          <p className="text-gray-600">See feedback from customers who visited your store.</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Select Owned Store */}
        <Card title="Select Your Store">
          {ownedStores.length === 0 ? (
            <p className="text-gray-500">No stores assigned to you.</p>
          ) : (
            <select
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
              className="w-full sm:w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose your store</option>
              {ownedStores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name} ({store.address.substring(0, 30)}...)
                </option>
              ))}
            </select>
          )}
        </Card>

        {/* Stats */}
        {selectedStoreId && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-700">Average Rating</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.average} ★</p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-gray-700">Total Ratings</h3>
              <p className="text-3xl font-bold text-green-600">{stats.total}</p>
            </Card>
          </div>
        )}

        {/* Ratings Table */}
        {selectedStoreId && ratings.length > 0 && (
          <Card title="Customer Feedback">
            {loading ? (
              <p className="text-gray-600">Loading ratings...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-2 text-left">Customer Name</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratings.map((r, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
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
            )}
          </Card>
        )}

        {/* No Ratings Yet */}
        {selectedStoreId && ratings.length === 0 && !loading && (
          <Card>
            <p className="text-gray-500">No ratings yet for this store. Keep providing great service!</p>
          </Card>
        )}
      </main>
    </div>
  );
}